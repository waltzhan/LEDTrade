/**
 * 第三方统计代码组件
 * 异步加载，不阻塞页面渲染
 */
export default function ThirdPartyAnalytics() {
  return (
    <>
      {/* 第三方统计代码 - 异步加载 */}
      <script
        async
        src="https://019d2412-07c1-7bd1-91d3-6a707a5e46b9.spst2.com/ustat.js"
      />
    </>
  );
}
