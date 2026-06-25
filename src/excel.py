import pandas as pd
import io

class Excel:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def merge_excels(file1, file2, final_columns_ordered, dedup_cols):

        # Lecture des fichiers
        df1 = pd.read_excel(file1)
        df2 = pd.read_excel(file2)

        df1 = df1.add_suffix("_df1")
        df2 = df2.add_suffix("_df2")

        # Colonnes servant au matching
        matching_columns = [
            col for col in final_columns_ordered
            if col.get("file1_name") and col.get("file2_name")
        ]

        if not matching_columns:
            raise ValueError(
                "Aucune colonne de correspondance n'a été définie entre les deux fichiers."
            )

        left_keys = [col["file1_name"] for col in matching_columns]
        right_keys = [col["file2_name"] for col in matching_columns]
        left_keys = [c + "_df1" for c in left_keys]
        right_keys = [c + "_df2" for c in right_keys]

        # Normalisation des clés pour éviter les problèmes
        # de casse ou d'espaces
        df1 = Excel.normalize(df1, left_keys)
        df2 = Excel.normalize(df2, right_keys)

        # Jointure : toutes les lignes de df1 sont conservées
        joined = df1.merge(
            df2,
            left_on=left_keys,
            right_on=right_keys,
            how="left"
        )

        # Construction du dataframe final
        result = pd.DataFrame()

        for col in sorted(final_columns_ordered, key=lambda x: x["position"]):

            final_name = col["name"]

            file1_col = col.get("file1_name")
            file2_col = col.get("file2_name")

            f1 = f"{file1_col}_df1" if file1_col else None
            f2 = f"{file2_col}_df2" if file2_col else None

            # Cas 1: colonne uniquement df1
            if f1 and not f2:
                result[final_name] = joined[f1]

            # Cas 2: colonne uniquement df2
            elif f2 and not f1:
                result[final_name] = joined[f2]

            # Cas 3: colonne de matching → on prend df1 (référence)
            elif f1 and f2:
                result[final_name] = joined[f1]

        # Déduplication éventuelle
        dedup_cols = [
            c for c in dedup_cols
            if c and c.strip() and c in result.columns
        ]

        if dedup_cols:
            result = result.drop_duplicates(subset=dedup_cols)

        # Export Excel
        output = io.BytesIO()

        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            result.to_excel(writer, index=False)

        output.seek(0)

        return output
    
    @staticmethod
    def get_columns(file):
        df = pd.read_excel(file)
        return list(df.columns)
    
    @staticmethod
    def normalize(df, cols):
        for c in cols:
            df[c] = (
                df[c]
                .astype(str)
                .str.strip()
                .str.lower()
            )
        return df
