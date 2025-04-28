export default class Responder {
  private status: boolean;
  private statusCode: number;
  private message: string | null;
  private data: object | null;
  private errors: object | null;

  constructor(
    status: boolean,
    message: string,
    statusCode: number,
    data: object | null = null,
    errors: object | null = null
  ) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success(message: string = "Request successful"): Responder {
    return new Responder(true, message, 200);
  }

  static fail(message: string = "Request failure"): Responder {
    return new Responder(false, message, 400);
  }

  setData(data: object): this {
    this.data = data;
    return this;
  }

  setErrors(errors: object): this {
    this.errors = errors;
    return this;
  }

  setStatusCode(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }

  build(c: any): Response {
    c.status(this.statusCode);
    return c.json({
      status: this.status,
      message: this.message,
      data: this.data,
      errors: this.errors,
    });
  }
}
