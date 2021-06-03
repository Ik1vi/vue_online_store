export default function goToPage(pageName, pageParams) {
  this.emitter.emit('pageName', pageName);
  this.emitter.emit('pageParams', pageParams);
}
