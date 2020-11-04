export class News {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  releaseDate: Date;
  title: string;
  subtitle: string;
  description: string;
  author: string;
  imagePath: string;
  content: string;
  category: string;

  constructor(data?) {
      console.log(data);
    data = data || {};
    this._id = data._id || null;
    this.creationDate = data.creationDate || null;
    this.lastEditDate = data.lastEditDate || null;
    this.releaseDate = data.releaseDate || null;
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.description = data.description || '';
    this.author = data.author || '';
    this.imagePath = data.imagePath || '';
    this.category = data.category || '';
    this.content = data.content || '';
  }
}
