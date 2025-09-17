import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'existing-variables',
  content: {
    required: t({
      en: 'Both variable name and value are required',
      ru: 'Требуются как имя переменной, так и ее значение',
    }),
    exists: t({
      en: 'Variable name already exists',
      ru: 'Имя переменной уже существует',
    }),
    added: t({
      en: 'Variable added successfully',
      ru: 'Переменная успешно добавлена',
    }),
    update: t({
      en: 'Variable updated successfully',
      ru: 'Переменная успешно обновлена',
    }),
    variable: t({
      en: 'Variable',
      ru: 'Переменная',
    }),
    deleted: t({
      en: 'deleted successfully',
      ru: 'успешно удалена',
    }),
    loading: t({
      en: 'Loading variables...',
      ru: 'Загрузка переменных...',
    }),
    variables: t({
      en: 'Variables',
      ru: 'Переменные',
    }),
    format: t({
      en: 'Use variables in your requests with the format',
      ru: 'Используйте переменные в своих запросах в следующем формате',
    }),
    examples: t({
      en: 'Examples',
      ru: 'Примеры',
    }),
    header: t({
      en: 'Header',
      ru: 'Заголовок',
    }),
    value: t({
      en: 'Value',
      ru: 'Значение',
    }),
    actions: t({
      en: 'Actions',
      ru: 'Действия',
    }),
    ['no-variables']: t({
      en: 'No variables yet. Add your first variable below.',
      ru: 'Переменных пока нет. Добавьте свою первую переменную ниже.',
    }),
    save: t({
      en: 'Save changes',
      ru: 'Сохранить изменения',
    }),
    cancel: t({
      en: 'Cancel editing',
      ru: 'Отменить редактирование',
    }),
    edit: t({
      en: 'Edit variable',
      ru: 'Редактировать переменную',
    }),
    delete: t({
      en: 'Delete variable',
      ru: 'Удалить переменную',
    }),
    ['variable-name']: t({
      en: 'Variable name',
      ru: 'Имя переменной',
    }),
    ['variable-value']: t({
      en: 'Variable value',
      ru: 'Значение переменной',
    }),
    add: t({
      en: 'Add',
      ru: 'Добавить',
    }),
  },
} satisfies Dictionary;

export default pageContent;
