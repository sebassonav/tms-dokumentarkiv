import { Heading, Select } from "@navikt/ds-react";
import { ChangeEvent } from "react";
import { postUser } from "../../api/api";
import { TextLanguages, text } from "../../language/text";
import { selectedUserAtom, setSelectedUser } from "../../store/store";
import { Fullmakter } from "../pages/landingsside/Landingsside";
import styles from "./RepresentasjonsContainer.module.css";
import {  pdlFullmaktUrl } from "../../urls";
import { useStore } from "@nanostores/react";

interface RepresentasjonsContainerProps {
  fullmakter: Fullmakter;
  language: TextLanguages;
  mutateSakstemaer: () => void;
  mutateUser: () => void;
  viserRepresentertesData: boolean | undefined;
}

const RepresentasjonsContainer = ({ fullmakter, language, mutateSakstemaer, mutateUser, viserRepresentertesData }: RepresentasjonsContainerProps) => {

  const handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.options[event.target.selectedIndex].text, event.target.value);
    await postUser({ ident: event.target.value });
    mutateSakstemaer();
    mutateUser();
  };

  const genererListe = () => {
    const originalUser = {navn: fullmakter.navn + " (Deg)", ident: fullmakter.ident}
    let nedtrekksliste = [originalUser];

    fullmakter?.fullmaktsGivere?.map((fullmaktsGiver) => {
      const user = { navn: fullmaktsGiver.navn, ident: fullmaktsGiver.ident };
        nedtrekksliste = [...nedtrekksliste, user]
    })

    return nedtrekksliste;
  };

  const nedtrekksliste = genererListe();
  const currentUser = useStore(selectedUserAtom);

  return (
    <>
      <div className={styles.container}>
        <Select
          className={styles.select}
          label={text.representasjonLabel[language]}
          onChange={handleSelectChange}
        >
          {fullmakter && nedtrekksliste?.map((fullmaktsGiver) => (
            <option value={fullmaktsGiver.ident}>{fullmaktsGiver.navn}</option>
          ))}
        </Select>
        <a href={pdlFullmaktUrl} className={styles.lenke}>{text.representasjonLenkeTekst[language]}</a>
      </div>
      {viserRepresentertesData && <Heading size="large" level="3" className={styles.heading}>{text.representasjonValgtBruker[language] + currentUser.navn}</Heading>}
    </>
  );
};

export default RepresentasjonsContainer;
