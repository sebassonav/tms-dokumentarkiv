import { Select } from "@navikt/ds-react";
import styles from "./RepresentasjonsContainer.module.css";
import { setSelectedUser } from "../../store/store";
import { TextLanguages, text } from "../../language/text";
import { ChangeEvent } from "react";
import { postUser } from "../../api/api";

type fullmaktsGiverConfig = {
  navn: string;
  ident: string;
};

export interface fullmakterProps {
  navn: string;
  ident: string;
  fullmaktsGivere: Array<fullmaktsGiverConfig>;
}

interface RepresentasjonsContainerProps {
  fullmakter: fullmakterProps;
  language: TextLanguages;
}

const RepresentasjonsContainer = ({ fullmakter, language }: RepresentasjonsContainerProps) => {

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);

    const postUserObj = {event: event.target.value}
    postUser(postUserObj)
  }

  return (
    <div className={styles.container}>
      <Select
        className={styles.select}
        label={text.dokumentarkiv[language]}
        description={text.representasjonDescription[language]}
        onChange={handleSelectChange}
      >
        <option value={fullmakter.ident}>{fullmakter.navn}</option>
        {fullmakter?.fullmaktsGivere?.map((fullmaktsGiver) => (
          <option value={fullmaktsGiver.ident}>{fullmaktsGiver.navn}</option>
        ))}
      </Select>
    </div>
  );
};

export default RepresentasjonsContainer;
