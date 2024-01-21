type TStorage = {
  theme: string;
};

export const STORAGE_KEY = "__the_ai_tech_blog__";

export class StorageHelper {
  static clear = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  static get = () => {
    const v = localStorage.getItem(STORAGE_KEY);

    return (v ? JSON.parse(v) : undefined) as TStorage;
  };

  static set = (v: Partial<TStorage>) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...StorageHelper.get(),
        ...v,
      })
    );
  };
}
