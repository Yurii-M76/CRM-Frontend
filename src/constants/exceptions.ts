export default {
  auth: {},
  users: {},
  persons: {
    formValidate: {
      surname: {
        cyrillicOnly: "Фамилия должна включать только буквы русского алфавита",
        moreLetters: "Фамилия должна состоять как минимум из двух букв",
        noSpaces: "Фамилия не должна содержать пробелы",
      },
      name: {
        cyrillicOnly: "Имя должно включать только буквы русского алфавита",
        moreLetters: "Имя должно состоять как минимум из двух букв",
        noSpaces: "Имя не должно содержать пробелы",
      },
      patronymic: {
        cyrillicOnly: "Отчество должно включать только буквы русского алфавита",
        moreLetters: "Отчество должно содержать пять и более букв",
        noSpaces: "Отчество не должно содержать пробелы",
      },
      invalidInput: "Некорректный ввод",
      requiredField: "Обязательное поле",
    },
  },
  projects: {},
  districts: {},
};
