import pandas as pd
import io

class Excel:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def merge_excels(file1, file2, final_columns_ordered, dedup_cols):
        # Lire les fichiers Excel
        df1 = pd.read_excel(file1)
        df2 = pd.read_excel(file2)

        # Renommer les colonnes selon la position finale
        rename_df1 = {col['file1_name']: col['name'] for col in final_columns_ordered if col.get('file1_name')}
        rename_df2 = {col['file2_name']: col['name'] for col in final_columns_ordered if col.get('file2_name')}

        df1 = df1.rename(columns=rename_df1)
        df2 = df2.rename(columns=rename_df2)

        # Garder uniquement les colonnes finales, dans le bon ordre
        final_cols = [col['name'] for col in final_columns_ordered]
        df1 = df1[[c for c in final_cols if c in df1.columns]]
        df2 = df2[[c for c in final_cols if c in df2.columns]]

        # Fusionner
        merged = pd.concat([df1, df2], ignore_index=True)

        # Normalisation pour suppression des doublons
        dedup_cols = [c for c in dedup_cols if c and c.strip() and c in merged.columns]
        for col in dedup_cols:
            merged[col] = merged[col].astype(str).str.strip().str.lower()
        
        if dedup_cols:
            merged = merged.drop_duplicates(subset=dedup_cols)

        # Export Excel
        output = io.BytesIO()
        merged.to_excel(output, index=False)
        output.seek(0)
        return output
    
    @staticmethod
    def get_columns(file):
        df = pd.read_excel(file)
        return list(df.columns)
