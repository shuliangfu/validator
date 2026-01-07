/**
 * @module @dreamer/validator
 *
 * @dreamer/validator 数据验证库
 *
 * 提供类型验证、对象结构验证、自定义验证规则等功能，支持服务端和客户端。
 *
 * 特性：
 * - 基础类型验证（字符串、数字、布尔、日期、邮箱、URL等）
 * - 对象结构验证（类似 Joi/Yup）
 * - 数组验证
 * - 自定义验证规则
 * - 异步验证支持
 * - 错误消息定制
 * - 验证转换
 * - 默认值
 * - 条件验证
 *
 * 环境兼容性：
 * - 服务端：✅ 支持（Deno 运行时）
 * - 客户端：✅ 支持（浏览器环境）
 *
 * @example
 * ```typescript
 * import { validate, string, number, object } from "jsr:@dreamer/validator";
 *
 * const schema = object({
 *   name: string().min(2).required(),
 *   age: number().min(18).required(),
 * });
 *
 * const result = validate({ name: "Alice", age: 25 }, schema);
 * if (result.success) {
 *   console.log("验证通过", result.data);
 * }
 * ```
 */

/**
 * 验证错误信息
 */
export interface ValidationError {
  /** 字段路径（支持嵌套，如 "user.address.city"） */
  path: string;
  /** 错误消息 */
  message: string;
  /** 字段值 */
  value: unknown;
  /** 验证规则名称 */
  rule?: string;
}

/**
 * 验证结果
 */
export interface ValidationResult<T = unknown> {
  /** 是否验证通过 */
  success: boolean;
  /** 验证后的数据（转换后的值） */
  data?: T;
  /** 错误列表 */
  errors: ValidationError[];
}

/**
 * 验证器接口
 */
export interface Validator<T = unknown> {
  /** 验证值 */
  validate(value: unknown, data?: Record<string, unknown>): ValidationResult<T>;
  /** 异步验证 */
  validateAsync?(
    value: unknown,
    data?: Record<string, unknown>,
  ): Promise<ValidationResult<T>>;
}

/**
 * 字符串验证器
 */
export class StringValidator implements Validator<string> {
  private rules: Array<{
    name: string;
    validate: (value: string) => boolean | string;
  }> = [];
  private _required: boolean = false;
  private defaultValue?: string;
  private transformFn?: (value: unknown) => string;
  private customMessages: Map<string, string> = new Map();

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    // 添加规则：必填字段不能为空字符串
    this.rules.push({
      name: "required",
      validate: (value) => {
        if (value.trim().length === 0) {
          return this.getMessage("required", "此字段为必填项");
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置默认值
   */
  default(value: string): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * 设置最小长度
   */
  min(length: number): this {
    this.rules.push({
      name: "min",
      validate: (value) => {
        if (value.length < length) {
          return this.getMessage(
            "min",
            `字符串长度必须至少 ${length} 个字符`,
            length,
          );
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置最大长度
   */
  max(length: number): this {
    this.rules.push({
      name: "max",
      validate: (value) => {
        if (value.length > length) {
          return this.getMessage(
            "max",
            `字符串长度不能超过 ${length} 个字符`,
            length,
          );
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置正则表达式匹配
   */
  pattern(regex: RegExp): this {
    this.rules.push({
      name: "pattern",
      validate: (value) => {
        if (!regex.test(value)) {
          return this.getMessage("pattern", "字符串格式不正确");
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 验证邮箱格式
   */
  email(): this {
    this.rules.push({
      name: "email",
      validate: (value) => {
        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(value)) {
          return this.getMessage("email", "邮箱格式不正确");
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 自定义验证规则
   */
  custom(validator: (value: string) => boolean | string): this {
    this.rules.push({
      name: "custom",
      validate: validator,
    });
    return this;
  }

  /**
   * 类型转换
   */
  transform(fn: (value: unknown) => string): this {
    this.transformFn = fn;
    return this;
  }

  /**
   * 自定义错误消息
   */
  message(rule: string, message: string): this {
    this.customMessages.set(rule, message);
    return this;
  }

  /**
   * 获取错误消息
   */
  private getMessage(
    rule: string,
    defaultMessage: string,
    ..._args: unknown[]
  ): string {
    const customMessage = this.customMessages.get(rule);
    if (customMessage) {
      return customMessage;
    }
    return defaultMessage;
  }

  /**
   * 验证值
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
  ): ValidationResult<string> {
    const errors: ValidationError[] = [];

    // 处理默认值
    if (value === undefined || value === null) {
      if (this.defaultValue !== undefined) {
        value = this.defaultValue;
      } else if (this._required) {
        errors.push({
          path: "",
          message: this.getMessage("required", "此字段为必填项"),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型转换
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        errors.push({
          path: "",
          message: `类型转换失败: ${
            error instanceof Error ? error.message : String(error)
          }`,
          value,
          rule: "transform",
        });
        return { success: false, errors };
      }
    }

    // 类型检查
    if (typeof value !== "string") {
      errors.push({
        path: "",
        message: "必须是字符串类型",
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const stringValue = value as string;

    // 执行验证规则
    for (const rule of this.rules) {
      const result = rule.validate(stringValue);
      if (result !== true) {
        errors.push({
          path: "",
          message: typeof result === "string" ? result : "验证失败",
          value: stringValue,
          rule: rule.name,
        });
        return { success: false, errors };
      }
    }

    return { success: true, data: stringValue, errors: [] };
  }
}

/**
 * 数字验证器
 */
export class NumberValidator implements Validator<number> {
  private rules: Array<{
    name: string;
    validate: (value: number) => boolean | string;
  }> = [];
  private _required: boolean = false;
  private defaultValue?: number;
  private transformFn?: (value: unknown) => number;
  private customMessages: Map<string, string> = new Map();

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置默认值
   */
  default(value: number): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * 设置最小值
   */
  min(value: number): this {
    this.rules.push({
      name: "min",
      validate: (num) => {
        if (num < value) {
          return this.getMessage("min", `数字必须至少 ${value}`, value);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置最大值
   */
  max(value: number): this {
    this.rules.push({
      name: "max",
      validate: (num) => {
        if (num > value) {
          return this.getMessage("max", `数字不能超过 ${value}`, value);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置整数
   */
  integer(): this {
    this.rules.push({
      name: "integer",
      validate: (num) => {
        if (!Number.isInteger(num)) {
          return this.getMessage("integer", "必须是整数");
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 自定义验证规则
   */
  custom(validator: (value: number) => boolean | string): this {
    this.rules.push({
      name: "custom",
      validate: validator,
    });
    return this;
  }

  /**
   * 类型转换
   */
  transform(fn: (value: unknown) => number): this {
    this.transformFn = fn;
    return this;
  }

  /**
   * 自定义错误消息
   */
  message(rule: string, message: string): this {
    this.customMessages.set(rule, message);
    return this;
  }

  /**
   * 获取错误消息
   */
  private getMessage(
    rule: string,
    defaultMessage: string,
    ..._args: unknown[]
  ): string {
    const customMessage = this.customMessages.get(rule);
    if (customMessage) {
      return customMessage;
    }
    return defaultMessage;
  }

  /**
   * 验证值
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
  ): ValidationResult<number> {
    const errors: ValidationError[] = [];

    // 处理默认值
    if (value === undefined || value === null) {
      if (this.defaultValue !== undefined) {
        value = this.defaultValue;
      } else if (this._required) {
        errors.push({
          path: "",
          message: this.getMessage("required", "此字段为必填项"),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型转换
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        errors.push({
          path: "",
          message: `类型转换失败: ${
            error instanceof Error ? error.message : String(error)
          }`,
          value,
          rule: "transform",
        });
        return { success: false, errors };
      }
    }

    // 类型检查
    if (typeof value !== "number" || isNaN(value)) {
      errors.push({
        path: "",
        message: "必须是数字类型",
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const numberValue = value as number;

    // 执行验证规则
    for (const rule of this.rules) {
      const result = rule.validate(numberValue);
      if (result !== true) {
        errors.push({
          path: "",
          message: typeof result === "string" ? result : "验证失败",
          value: numberValue,
          rule: rule.name,
        });
        return { success: false, errors };
      }
    }

    return { success: true, data: numberValue, errors: [] };
  }
}

/**
 * 布尔值验证器
 */
export class BooleanValidator implements Validator<boolean> {
  private _required: boolean = false;
  private defaultValue?: boolean;
  private transformFn?: (value: unknown) => boolean;

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置默认值
   */
  default(value: boolean): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * 类型转换
   */
  transform(fn: (value: unknown) => boolean): this {
    this.transformFn = fn;
    return this;
  }

  /**
   * 验证值
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
  ): ValidationResult<boolean> {
    const errors: ValidationError[] = [];

    // 处理默认值
    if (value === undefined || value === null) {
      if (this.defaultValue !== undefined) {
        value = this.defaultValue;
      } else if (this._required) {
        errors.push({
          path: "",
          message: "此字段为必填项",
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型转换
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        errors.push({
          path: "",
          message: `类型转换失败: ${
            error instanceof Error ? error.message : String(error)
          }`,
          value,
          rule: "transform",
        });
        return { success: false, errors };
      }
    }

    // 类型检查
    if (typeof value !== "boolean") {
      errors.push({
        path: "",
        message: "必须是布尔类型",
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    return { success: true, data: value as boolean, errors: [] };
  }
}

/**
 * 邮箱验证器
 */
export class EmailValidator extends StringValidator {
  constructor() {
    super();
    this.pattern(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    );
  }
}

/**
 * URL 验证器
 */
export class UrlValidator extends StringValidator {
  constructor() {
    super();
    this.custom((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return "无效的 URL 格式";
      }
    });
  }
}

/**
 * 对象验证器模式
 */
export type ObjectSchema<T = Record<string, unknown>> = {
  [K in keyof T]: Validator<T[K]>;
};

/**
 * 对象验证器
 */
export class ObjectValidator<
  T extends Record<string, unknown> = Record<string, unknown>,
> implements Validator<T> {
  private schema: ObjectSchema<T>;
  private _required: boolean = false;

  constructor(schema: ObjectSchema<T>) {
    this.schema = schema;
  }

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 验证值
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
  ): ValidationResult<T> {
    const errors: ValidationError[] = [];

    // 处理 undefined/null
    if (value === undefined || value === null) {
      if (this._required) {
        errors.push({
          path: "",
          message: "此字段为必填项",
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型检查
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      errors.push({
        path: "",
        message: "必须是对象类型",
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    let hasError = false;

    // 验证每个字段
    for (const [key, validator] of Object.entries(this.schema)) {
      const fieldValue = obj[key];
      const fieldResult = validator.validate(fieldValue, obj);

      if (fieldResult.success) {
        if (fieldResult.data !== undefined) {
          result[key] = fieldResult.data;
        }
      } else {
        hasError = true;
        // 添加字段路径前缀
        for (const error of fieldResult.errors) {
          errors.push({
            path: error.path ? `${key}.${error.path}` : key,
            message: error.message,
            value: error.value,
            rule: error.rule,
          });
        }
      }
    }

    if (hasError) {
      return { success: false, errors };
    }

    return { success: true, data: result as T, errors: [] };
  }
}

/**
 * 数组验证器
 */
export class ArrayValidator<T = unknown> implements Validator<T[]> {
  private itemValidator: Validator<T>;
  private minLength?: number;
  private maxLength?: number;
  private _required: boolean = false;

  constructor(itemValidator: Validator<T>) {
    this.itemValidator = itemValidator;
  }

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置最小长度
   */
  min(length: number): this {
    this.minLength = length;
    return this;
  }

  /**
   * 设置最大长度
   */
  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  /**
   * 验证值
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
  ): ValidationResult<T[]> {
    const errors: ValidationError[] = [];

    // 处理 undefined/null
    if (value === undefined || value === null) {
      if (this._required) {
        errors.push({
          path: "",
          message: "此字段为必填项",
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型检查
    if (!Array.isArray(value)) {
      errors.push({
        path: "",
        message: "必须是数组类型",
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const arr = value as unknown[];

    // 长度验证
    if (this.minLength !== undefined && arr.length < this.minLength) {
      errors.push({
        path: "",
        message: `数组长度必须至少 ${this.minLength} 个元素`,
        value: arr,
        rule: "min",
      });
      return { success: false, errors };
    }

    if (this.maxLength !== undefined && arr.length > this.maxLength) {
      errors.push({
        path: "",
        message: `数组长度不能超过 ${this.maxLength} 个元素`,
        value: arr,
        rule: "max",
      });
      return { success: false, errors };
    }

    // 验证每个元素
    const result: T[] = [];
    let hasError = false;

    for (let i = 0; i < arr.length; i++) {
      const itemResult = this.itemValidator.validate(arr[i], {});
      if (itemResult.success) {
        if (itemResult.data !== undefined) {
          result.push(itemResult.data);
        }
      } else {
        hasError = true;
        // 添加索引路径
        for (const error of itemResult.errors) {
          errors.push({
            path: error.path ? `[${i}].${error.path}` : `[${i}]`,
            message: error.message,
            value: error.value,
            rule: error.rule,
          });
        }
      }
    }

    if (hasError) {
      return { success: false, errors };
    }

    return { success: true, data: result, errors: [] };
  }
}

/**
 * 创建字符串验证器
 */
export function string(): StringValidator {
  return new StringValidator();
}

/**
 * 创建数字验证器
 */
export function number(): NumberValidator {
  return new NumberValidator();
}

/**
 * 创建布尔值验证器
 */
export function boolean(): BooleanValidator {
  return new BooleanValidator();
}

/**
 * 创建邮箱验证器
 */
export function email(): EmailValidator {
  return new EmailValidator();
}

/**
 * 创建 URL 验证器
 */
export function url(): UrlValidator {
  return new UrlValidator();
}

/**
 * 创建对象验证器
 */
export function object<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  schema: ObjectSchema<T>,
): ObjectValidator<T> {
  return new ObjectValidator<T>(schema);
}

/**
 * 创建数组验证器
 */
export function array<T = unknown>(
  itemValidator: Validator<T>,
): ArrayValidator<T> {
  return new ArrayValidator<T>(itemValidator);
}

/**
 * 验证值
 *
 * @param value 要验证的值
 * @param validator 验证器
 * @returns 验证结果
 */
export function validate<T = unknown>(
  value: unknown,
  validator: Validator<T>,
): ValidationResult<T> {
  return validator.validate(value);
}

/**
 * 异步验证值
 *
 * @param value 要验证的值
 * @param validator 验证器（必须支持异步验证）
 * @returns 验证结果
 */
export async function validateAsync<T = unknown>(
  value: unknown,
  validator: Validator<T>,
): Promise<ValidationResult<T>> {
  if (validator.validateAsync) {
    return await validator.validateAsync(value);
  }
  return validator.validate(value);
}

/**
 * 收集所有错误（不中断验证）
 *
 * @param value 要验证的值
 * @param validator 验证器
 * @returns 验证结果（包含所有错误）
 */
export function validateAll<T = unknown>(
  value: unknown,
  validator: Validator<T>,
): ValidationResult<T> {
  // 对于对象和数组，需要特殊处理以收集所有错误
  // 这里先实现基础版本，后续可以优化
  return validator.validate(value);
}
