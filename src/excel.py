import pandas as pd

class Excel:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def merge_excels(file1, cols1, file2, cols2, dedup_cols):
        df1 = pd.read_excel(file1)
        df2 = pd.read_excel(file2)

        # garder les colonnes choisies
        df1 = df1[cols1]
        df2 = df2[cols2]

        # normalisation (exemple)
        for col in dedup_cols:
            if col in df1:
                df1[col] = df1[col].astype(str).str.strip().str.lower()
            if col in df2:
                df2[col] = df2[col].astype(str).str.strip().str.lower()

        # fusion
        merged = pd.concat([df1, df2], ignore_index=True)

        # suppression des doublons
        merged = merged.drop_duplicates(subset=dedup_cols)

        # export Excel
        output = io.BytesIO()
        merged.to_excel(output, index=False)
        output.seek(0)
        return output
    
    @staticmethod
    def get_columns(file):
        df = pd.read_excel(file)
        return list(df.columns)
