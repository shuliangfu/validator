/**
 * @fileoverview Validator 测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import { string, number, validate, object } from "../src/mod.ts";

describe("Validator", () => {
  describe("string", () => {
    it("应该验证字符串", () => {
      const result = validate("hello", string());
      expect(result.success).toBeTruthy();
    });

    it("应该验证必填", () => {
      const result = validate("", string().required());
      expect(result.success).toBeFalsy();
    });

    it("应该验证最小长度", () => {
      const result = validate("hi", string().min(3));
      expect(result.success).toBeFalsy();
    });

    it("应该验证最大长度", () => {
      const result = validate("hello", string().max(3));
      expect(result.success).toBeFalsy();
    });

    it("应该验证邮箱格式", () => {
      const result1 = validate("test@example.com", string().email());
      const result2 = validate("invalid", string().email());
      expect(result1.success).toBeTruthy();
      expect(result2.success).toBeFalsy();
    });
  });

  describe("number", () => {
    it("应该验证数字", () => {
      const result = validate(123, number());
      expect(result.success).toBeTruthy();
    });

    it("应该验证最小值", () => {
      const result = validate(5, number().min(10));
      expect(result.success).toBeFalsy();
    });

    it("应该验证最大值", () => {
      const result = validate(15, number().max(10));
      expect(result.success).toBeFalsy();
    });
  });

  describe("object", () => {
    it("应该验证对象结构", () => {
      const schema = object({
        name: string().required(),
        age: number().min(0).required(),
      });

      const result1 = validate({ name: "Alice", age: 25 }, schema);
      const result2 = validate({ name: "", age: 25 }, schema);

      expect(result1.success).toBeTruthy();
      expect(result2.success).toBeFalsy();
    });
  });
});
