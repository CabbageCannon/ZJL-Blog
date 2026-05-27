// 将时间字符串转换成一个包含year,month(2位),day(2位)的对象
export function formatDate(dateStr){
  let date={};
  const d=new Date(dateStr);
  // dateStr格式不正确则返回空字符串
  if(Number.isNaN(d.getTime()))return date;
  date.year=d.getFullYear();
  date.month=d.getMonth()+1;
  date.day=d.getDate();
  return date;
}