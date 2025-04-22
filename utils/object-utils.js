import {isNull, isUndefined, omit, pick} from "lodash-es";

const propiedadesNoVacias = (objeto) =>
  Object.getOwnPropertyNames(objeto).filter(pn => !isNull(objeto[pn]) && !isUndefined(objeto[pn]));

export const reemplazarValoresNoNulos = (objetoBase, actualizaciones) =>
  Object.assign(objetoBase, pick(actualizaciones, propiedadesNoVacias(actualizaciones)))
