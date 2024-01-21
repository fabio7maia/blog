export class TextHelper {
  static removeAccents = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  static transformToUrl = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll(" ", "-")
      .toLowerCase();
}
