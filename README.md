# @dreamer/validator

> ⚠️ **重要通知：此库已迁移，不再维护**

<div align="center" style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">

## 🚨 此库已迁移到 @dreamer/utils

**`@dreamer/validator` 已合并到 `@dreamer/utils` 库，此库不再维护。**

### 📦 新的使用方式

```typescript
// ❌ 旧方式（已废弃）
import { validate, string, number } from "jsr:@dreamer/validator";

// ✅ 新方式（推荐）
import { validate, string, number } from "jsr:@dreamer/utils/validator";
```

### 🔄 迁移指南

1. **更新导入路径**：
   - 将 `jsr:@dreamer/validator` 替换为 `jsr:@dreamer/utils/validator`
   - API 完全兼容，无需修改代码逻辑

2. **更新依赖**：
   ```bash
   # 移除旧依赖
   deno remove jsr:@dreamer/validator

   # 添加新依赖
   deno add jsr:@dreamer/utils
   ```

3. **查看新文档**：
   - 📖 [@dreamer/utils 文档](https://jsr.io/@dreamer/utils)
   - 📖 [validator 详细文档](https://jsr.io/@dreamer/utils/doc/~/validator)

### ⚠️ 注意

- 此库的 JSR 包可能仍然可用，但**不再更新和维护**
- 所有新功能和修复都在 `@dreamer/utils` 中
- 建议尽快迁移到新库

</div>

---

> 一个兼容 Deno 和 Bun 的数据验证库，提供类型验证、对象结构验证、自定义验证规则等功能

[![JSR](https://jsr.io/badges/@dreamer/validator)](https://jsr.io/@dreamer/validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

数据验证库，用于验证表单数据、API 参数、配置等，支持服务端和客户端。

## 特性

- **基础类型验证**：
  - 字符串验证（长度、格式、模式匹配）
  - 数字验证（范围、整数、小数）
  - 布尔值验证
  - 日期验证（格式、范围）
  - 邮箱验证
  - URL 验证
  - IP 地址验证
  - 手机号验证（支持多国家）
  - 身份证验证（支持多国家）
- **对象结构验证**：
  - 嵌套对象验证
  - 数组验证（元素类型、长度）
  - 可选字段验证
  - 条件验证（依赖字段）
  - 联合类型验证（oneOf、anyOf）
  - 枚举值验证
- **高级验证**：
  - 自定义验证规则
  - 异步验证（数据库查询、API 调用）
  - 验证链（多个验证规则组合）
  - 验证转换（验证时自动转换类型）
  - 验证默认值
- **错误处理**：
  - 详细的错误消息
  - 错误消息定制（国际化支持）
  - 错误路径（嵌套字段错误定位）
  - 错误收集（收集所有错误，不中断验证）
  - 错误格式化（JSON、文本格式）
- **性能优化**：
  - 快速失败（遇到第一个错误即停止）
  - 批量验证
  - 验证缓存（相同规则缓存）

## 使用场景

- 表单验证（前端表单、后端 API 参数）
- API 参数验证（请求参数、查询参数、Body 验证）
- 配置验证（配置文件、环境变量验证）
- 数据转换和清理（验证时自动转换类型）
- 数据校验（导入数据、用户输入）

## 安装

> ⚠️ **此库已迁移，请使用新库**

```bash
# ❌ 旧方式（已废弃，不再维护）
deno add jsr:@dreamer/validator

# ✅ 新方式（推荐）
deno add jsr:@dreamer/utils
# 然后使用：import { validate, string, number } from "jsr:@dreamer/utils/validator"
```

## 环境兼容性

- **运行时要求**：Deno 2.5+ 或 Bun 1.0+
- **服务端**：✅ 支持（兼容 Deno 和 Bun 运行时）
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

> ⚠️ **注意：以下示例使用旧导入路径，请迁移到 `jsr:@dreamer/utils/validator`**

### 基础类型验证

```typescript
// ⚠️ 旧导入（已废弃）
// import { validate, string, number, email, url, boolean } from "jsr:@dreamer/validator";

// ✅ 新导入（推荐）
import { validate, string, number, email, url, boolean } from "jsr:@dreamer/utils/validator";

// 字符串验证
const result1 = validate("hello", string().min(3).max(10));
// ✅ 通过

const result2 = validate("hi", string().min(3));
// ❌ 失败：字符串长度必须至少 3 个字符

// 数字验证
const result3 = validate(25, number().min(18).max(100));
// ✅ 通过

const result4 = validate(15, number().min(18));
// ❌ 失败：数字必须至少 18

// 邮箱验证
const result5 = validate("user@example.com", email());
// ✅ 通过

const result6 = validate("invalid-email", email());
// ❌ 失败：无效的邮箱格式

// URL 验证
const result7 = validate("https://example.com", url());
// ✅ 通过

// 布尔值验证
const result8 = validate(true, boolean());
// ✅ 通过
```

### 对象结构验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, number, array, optional } from "jsr:@dreamer/utils/validator";

// 定义验证模式
const userSchema = object({
  name: string().min(2).max(50).required(),
  email: email().required(),
  age: number().min(18).max(120).optional(),
  tags: array(string()).min(1).max(10).optional(),
});

// 验证对象
const user = {
  name: "Alice",
  email: "alice@example.com",
  age: 25,
  tags: ["developer", "typescript"],
};

const result = validate(user, userSchema);
if (result.success) {
  console.log("验证通过", result.data);
} else {
  console.log("验证失败", result.errors);
  // [
  //   { path: "name", message: "..." },
  //   { path: "email", message: "..." }
  // ]
}
```

### 嵌套对象验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, number } from "jsr:@dreamer/utils/validator";

const addressSchema = object({
  street: string().required(),
  city: string().required(),
  zipCode: string().pattern(/^\d{5}$/).required(),
});

const userSchema = object({
  name: string().required(),
  address: addressSchema.required(),
  contacts: object({
    phone: string().pattern(/^\d{10}$/).required(),
    email: email().required(),
  }).required(),
});

const user = {
  name: "Bob",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001",
  },
  contacts: {
    phone: "1234567890",
    email: "bob@example.com",
  },
};

const result = validate(user, userSchema);
```

### 数组验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, array, string, number, object } from "jsr:@dreamer/utils/validator";

// 字符串数组
const tagsSchema = array(string()).min(1).max(10);

// 数字数组
const scoresSchema = array(number().min(0).max(100)).min(3).max(5);

// 对象数组
const usersSchema = array(
  object({
    name: string().required(),
    age: number().min(18).required(),
  })
).min(1);

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

const result = validate(users, usersSchema);
```

### 条件验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, number, when } from "jsr:@dreamer/utils/validator";

const userSchema = object({
  type: string().oneOf(["admin", "user"]).required(),
  // 当 type 为 "admin" 时，role 字段必填
  role: when("type", (type) => {
    if (type === "admin") {
      return string().required();
    }
    return string().optional();
  }),
  // 当 age >= 18 时，license 字段必填
  license: when("age", (age) => {
    if (age >= 18) {
      return string().required();
    }
    return string().optional();
  }),
  age: number().min(0).required(),
});
```

### 自定义验证规则

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, string, custom } from "jsr:@dreamer/utils/validator";

// 自定义验证函数
const passwordSchema = string()
  .min(8)
  .custom((value) => {
    // 必须包含至少一个大写字母
    if (!/[A-Z]/.test(value)) {
      return "密码必须包含至少一个大写字母";
    }
    // 必须包含至少一个数字
    if (!/\d/.test(value)) {
      return "密码必须包含至少一个数字";
    }
    return true; // 验证通过
  });

const result = validate("MyPassword123", passwordSchema);
```

### 异步验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validateAsync, string, customAsync } from "jsr:@dreamer/utils/validator";

// 异步验证：检查用户名是否已存在
const usernameSchema = string()
  .min(3)
  .max(20)
  .customAsync(async (value) => {
    // 调用 API 检查用户名
    const response = await fetch(`/api/check-username?username=${value}`);
    const data = await response.json();
    if (data.exists) {
      return "用户名已存在";
    }
    return true;
  });

const result = await validateAsync("alice", usernameSchema);
```

### 验证转换

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, string, number, transform } from "jsr:@dreamer/utils/validator";

// 自动转换类型
const userSchema = object({
  name: string().required(),
  age: number().transform((value) => {
    // 字符串转数字
    if (typeof value === "string") {
      return parseInt(value, 10);
    }
    return value;
  }),
  email: string().transform((value) => {
    // 转换为小写
    return value.toLowerCase();
  }),
});

const user = {
  name: "Alice",
  age: "25", // 字符串，会自动转换为数字
  email: "ALICE@EXAMPLE.COM", // 会自动转换为小写
};

const result = validate(user, userSchema);
// result.data.age 是数字 25
// result.data.email 是 "alice@example.com"
```

### 默认值

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, number, optional } from "jsr:@dreamer/utils/validator";

const userSchema = object({
  name: string().required(),
  age: number().default(18), // 默认值 18
  role: string().default("user"), // 默认值 "user"
  active: boolean().default(true), // 默认值 true
});

const user = {
  name: "Alice",
  // age、role、active 未提供，会使用默认值
};

const result = validate(user, userSchema);
// result.data = {
//   name: "Alice",
//   age: 18,
//   role: "user",
//   active: true
// }
```

### 错误消息定制

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, string, number, setMessages } from "jsr:@dreamer/utils/validator";

// 设置全局错误消息
setMessages({
  required: "此字段为必填项",
  min: (field, min) => `${field} 必须至少 ${min} 个字符`,
  max: (field, max) => `${field} 不能超过 ${max} 个字符`,
  email: "请输入有效的邮箱地址",
});

// 或为特定字段设置错误消息
const userSchema = object({
  name: string()
    .min(2)
    .message("min", "姓名必须至少 2 个字符")
    .required()
    .message("required", "姓名是必填项"),
  email: email().message("email", "请输入有效的邮箱地址"),
});
```

### API 参数验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, number, array } from "jsr:@dreamer/utils/validator";
import { Request } from "jsr:@dreamer/http";

// API 路由参数验证
export async function GET(request: Request) {
  // 验证查询参数
  const querySchema = object({
    page: number().min(1).default(1),
    limit: number().min(1).max(100).default(10),
    search: string().optional(),
  });

  const queryResult = validate(request.query, querySchema);
  if (!queryResult.success) {
    return Response.json({ errors: queryResult.errors }, { status: 400 });
  }

  // 使用验证后的数据
  const { page, limit, search } = queryResult.data;
  // ...
}

// API Body 验证
export async function POST(request: Request) {
  const body = await request.json();

  const bodySchema = object({
    name: string().min(2).max(50).required(),
    email: email().required(),
    age: number().min(18).max(120).optional(),
  });

  const bodyResult = validate(body, bodySchema);
  if (!bodyResult.success) {
    return Response.json({ errors: bodyResult.errors }, { status: 400 });
  }

  // 使用验证后的数据
  const { name, email, age } = bodyResult.data;
  // ...
}
```

### 表单验证

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, email, number } from "jsr:@dreamer/utils/validator";

// 前端表单验证
const formSchema = object({
  username: string().min(3).max(20).required(),
  email: email().required(),
  password: string()
    .min(8)
    .custom((value) => {
      if (!/[A-Z]/.test(value)) {
        return "密码必须包含至少一个大写字母";
      }
      if (!/\d/.test(value)) {
        return "密码必须包含至少一个数字";
      }
      return true;
    })
    .required(),
  confirmPassword: string()
    .custom((value, data) => {
      if (value !== data.password) {
        return "两次输入的密码不一致";
      }
      return true;
    })
    .required(),
  age: number().min(18).max(120).optional(),
});

// 实时验证
function handleInput(field: string, value: any) {
  const result = validate({ [field]: value }, object({ [field]: formSchema.fields[field] }));
  if (!result.success) {
    // 显示错误消息
    showError(field, result.errors[0].message);
  } else {
    // 清除错误消息
    clearError(field);
  }
}

// 提交时完整验证
function handleSubmit(formData: any) {
  const result = validate(formData, formSchema);
  if (!result.success) {
    // 显示所有错误
    result.errors.forEach((error) => {
      showError(error.path, error.message);
    });
    return;
  }

  // 提交数据
  submitForm(result.data);
}
```

### 验证链

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, string, chain } from "jsr:@dreamer/utils/validator";

// 多个验证规则组合
const emailSchema = chain(
  string().required(),
  email(),
  string().custom((value) => {
    // 检查邮箱域名
    if (!value.endsWith("@example.com")) {
      return "邮箱必须是 @example.com 域名";
    }
    return true;
  })
);

const result = validate("user@example.com", emailSchema);
```

### 错误收集（收集所有错误）

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validateAll, object, string, number } from "jsr:@dreamer/utils/validator";

const userSchema = object({
  name: string().min(2).required(),
  email: email().required(),
  age: number().min(18).required(),
});

const user = {
  name: "A", // 错误：太短
  email: "invalid", // 错误：无效邮箱
  age: 15, // 错误：年龄太小
};

// 收集所有错误，不中断验证
const result = validateAll(user, userSchema);
// result.errors 包含所有三个错误
```

### 验证结果处理

```typescript
// ⚠️ 注意：已迁移到 jsr:@dreamer/utils/validator
import { validate, object, string, number } from "jsr:@dreamer/utils/validator";

const userSchema = object({
  name: string().required(),
  age: number().min(18).required(),
});

const result = validate({ name: "Alice", age: 15 }, userSchema);

if (result.success) {
  // 验证通过
  console.log("验证通过", result.data);
} else {
  // 验证失败
  console.log("验证失败");
  console.log("错误数量:", result.errors.length);
  console.log("错误详情:", result.errors);

  // 错误格式：
  // [
  //   { path: "age", message: "数字必须至少 18", value: 15 },
  //   ...
  // ]

  // 按字段分组错误
  const errorsByField = result.errors.reduce((acc, error) => {
    if (!acc[error.path]) {
      acc[error.path] = [];
    }
    acc[error.path].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);
}
```

## API 说明

### 核心函数

- `validate(value, schema)`：同步验证
- `validateAsync(value, schema)`：异步验证
- `validateAll(value, schema)`：收集所有错误（不中断验证）
- `setMessages(messages)`：设置全局错误消息

### 验证器类型

- `string()`：字符串验证器
- `number()`：数字验证器
- `boolean()`：布尔值验证器
- `date()`：日期验证器
- `email()`：邮箱验证器
- `url()`：URL 验证器
- `ip()`：IP 地址验证器
- `phone()`：手机号验证器
- `idCard()`：身份证验证器
- `array(schema)`：数组验证器
- `object(schema)`：对象验证器
- `oneOf(values)`：枚举值验证器
- `custom(validator)`：自定义验证器
- `customAsync(validator)`：异步自定义验证器
- `when(field, schema)`：条件验证器
- `chain(...validators)`：验证链

### 验证器方法

- `.required()`：必填
- `.optional()`：可选
- `.default(value)`：默认值
- `.min(value)`：最小值/最小长度
- `.max(value)`：最大值/最大长度
- `.pattern(regex)`：正则匹配
- `.transform(fn)`：类型转换
- `.custom(fn)`：自定义验证
- `.customAsync(fn)`：异步自定义验证
- `.message(key, message)`：自定义错误消息

## 验证器方法链式调用

所有验证器都支持链式调用：

```typescript
string()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z0-9]+$/)
  .required()
  .message("pattern", "只能包含字母和数字");
```

## 性能优化

- **快速失败**：默认情况下，遇到第一个错误即停止验证
- **批量验证**：使用 `validateAll` 收集所有错误
- **验证缓存**：相同验证规则会缓存，提升性能
- **类型推断**：完整的 TypeScript 类型支持，编译时类型检查


## 📝 备注

- 支持服务端和客户端，API 完全一致
- 完整的 TypeScript 类型支持，提供优秀的开发体验
- 错误消息支持国际化，可以自定义错误消息
- 支持验证时自动转换类型，方便数据处理
- 适合表单验证、API 参数验证、配置验证等场景

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](./LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
