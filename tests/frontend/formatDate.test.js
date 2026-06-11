import { describe, it, expect } from "vitest";
import { formatDate } from "../../frontend/js/modules/utils/formatDate.js"

// describe描述一组测试
describe("formatData", () => {
  // it表示一个具体测试场景
  it("可以把有效日期转换成年月日对象", () => {
    const result = formatDate("2026-06-05T12:00:00");

    // 期望测试结果
    expect(result).toEqual({
      year: 2026,
      month: 6,
      day: 5
    });
  });

  it("遇到无效日期时返回空对象", () => {
    const result = formatDate("not-a-date");

    expect(result).toEqual({});
  })
})