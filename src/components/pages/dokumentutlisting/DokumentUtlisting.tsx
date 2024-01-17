import { useStore } from "@nanostores/react";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "../../../api/api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { text } from "../../../language/text";
import { languageAtom, setIsError } from "../../../store/store";
import { getFullmaktInfoUrl, mineSakerApiUrl } from "../../../urls";
import { format } from "date-fns";
import styles from "./DokumentUtlisting.module.css";
import IngenDokumenter from "./IngenDokumenter";
import Disclaimer from "./disclaimer/Disclaimer";
import Lenkepanel from "../../nyttig-og-vite/Lenkepanel";
import TemaLenke from "../../temaside-lenke/TemaLenke";
import Dokumentliste from "../../dokumentliste/Dokumentliste";

export interface FullmaktInfoProps {
  viserRepresentertesData: boolean;
  representertNavn: string;
  representertIdent: string;
}

const DokumentUtlisting = () => {
  const { temakode, journalpostId } = useParams();

  const dokumentlisteUrl = journalpostId
    ? `${mineSakerApiUrl}/sakstema/${temakode}/journalpost/${journalpostId}`
    : `${mineSakerApiUrl}/sakstema/${temakode}/journalposter`;

  const { data: dokumentliste, isLoading } = useSWRImmutable({ path: dokumentlisteUrl }, fetcher, {
    shouldRetryOnError: false,
    onError: setIsError,
  });

  const { data: fullmaktInfo } = useSWR<FullmaktInfoProps>({ path: getFullmaktInfoUrl }, fetcher, {
    shouldRetryOnError: false,
    onError: setIsError,
  });

  const language = useStore(languageAtom);

  const isContent = dokumentliste?.journalposter.length > 0;

  useBreadcrumbs({
    url: `/dokumentarkiv/tema/${temakode}`,
    title: isContent ? dokumentliste.navn : "...",
    handleInApp: true,
  });

  if (isLoading) {
    return null;
  }

  const temaNavn = isContent && dokumentliste?.navn;
  const isAarsoppgaveTema = temakode === "STO";
  const dato = isContent && format(new Date(dokumentliste?.journalposter[0].sisteEndret), "dd.MM.yyyy");

  return (
    <>
      <Heading level="1" size="xlarge">
        {isContent
          ? isAarsoppgaveTema
            ? text.aarsoppgaveTittel[language]
            : dokumentliste?.navn
          : text.dokumentArkivTittel[language]}
      </Heading>
      {isContent ? (
        <div>
          <BodyLong size="medium" className={styles.ingress} aria-live="polite">
            {text.dokumentArkivIngress[language] + " " + temaNavn}
            {fullmaktInfo?.viserRepresentertesData ? (
              <span>{" for " + fullmaktInfo.representertNavn + ". "}</span>
            ) : null}
            <TemaLenke lenketekst={temaNavn} />
          </BodyLong>
          <BodyShort className={styles.sistEndret}>{text.sistEndret[language] + " " + dato}</BodyShort>
          <Dokumentliste />
          <Lenkepanel />
        </div>
      ) : (
        <IngenDokumenter />
      )}
      <Disclaimer />
    </>
  );
};

export default DokumentUtlisting;
