export const isPc = () => {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      return false;
  } else {
      return true;
  }
}
export const isIos = () => {
  if (isServer) return;
  const u = navigator.userAgent,
      app = navigator.appVersion;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || !!u.match(/\(Macintosh;/);
}
export const isApp = () => {
  if (isServer) return;
  return VueCookie.get('kmf_appinner') != null ? true : false;
}
export const isAndroid = () => {
  if (isServer) return;
  const u = navigator.userAgent,
      app = navigator.appVersion;
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
}