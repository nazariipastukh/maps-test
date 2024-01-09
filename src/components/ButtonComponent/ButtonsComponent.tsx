import React, {FC} from "react";

import styles from './ButtonsComponent.module.css'

interface IProps {
    deleteAll: () => void
}

export const ButtonsComponent: FC<IProps> = ({deleteAll}) => {
    return (
        <section className={styles.buttons}>
            <button onClick={deleteAll}>Delete All Markers</button>
        </section>
    );
};