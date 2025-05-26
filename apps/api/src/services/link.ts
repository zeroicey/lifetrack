export class LinkService {
  public async requestTitle(url: string) {
    const res = await fetch(url);
    const text = await res.text();
    console.log(text.search("<title"));
    console.log(text.slice(1258, 1300));
    const title = text.match(/<title>(.*?)<\/title>/);
    console.log(title);
    return title;
  }
}
