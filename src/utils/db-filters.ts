import lodash, { has, set } from "lodash";
import { Op } from "sequelize";

function buildFilter(filterObj: any, key: any) {
  if (typeof key !== "string") {
    key = key[0];
  }
  if (key === "and") {
    return {
      [Op.and]: filterObj["and"].map((item: any) => {
        return {
          [Op.and]: Object.keys(item).map((currentKey: any) => {
            return buildFilter(item, currentKey);
          }),
        };
      }),
    };
  } else if (key === "or") {
    return {
      [Op.or]: filterObj["or"].map((item: any) => {
        return {
          [Op.and]: Object.keys(item).map((currentKey: any) => {
            return buildFilter(item, currentKey);
          }),
        };
      }),
    };
  } else {
    let where = {};
    let obj = filterObj[key];
    if (lodash.has(obj, "eq")) {
      set(where, [key], {
        [Op.eq]: obj.eq,
      });
    } else if (has(obj, "lt")) {
      set(where, [key], {
        [Op.lt]: obj.lt,
      });
    } else if (has(obj, "lte")) {
      set(where, [key], {
        [Op.lte]: obj.lte,
      });
    } else if (has(obj, "gt")) {
      set(where, [key], {
        [Op.gt]: obj.gt,
      });
    } else if (has(obj, "gte")) {
      set(where, [key], {
        [Op.gte]: obj.gte,
      });
    } else if (has(obj, "isNull")) {
      set(where, [key], {
        [Op.is]: null,
      });
    } else if (has(obj, "isNotNull")) {
      set(where, [key], {
        [Op.not]: null,
      });
    } else if (has(obj, "neq")) {
      set(where, [key], {
        [Op.ne]: obj.neq,
      });
    } else if (has(obj, "like")) {
      set(where, [key], {
        [Op.like]: `%${obj.like}%`,
      });
    } else if (has(obj, "notLike")) {
      set(where, [key], {
        [Op.notLike]: `%${obj.notLike}%`,
      });
    } else {
      set(where, [key], {
        [Op.eq]: obj,
      });
    }
    return where;
  }
}

export function buildDbFilter(filter: any) {
  let where: any = {};
  let and = [];
  for (const key in filter) {
    and.push(buildFilter(filter, [key]));
  }
  where = {
    [Op.and]: and,
  };
  return where;
}
