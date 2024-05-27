const title = process.env.VUE_APP_BASE_NAME || 'leapting';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}-${title}`;
  }
  return title;
}
