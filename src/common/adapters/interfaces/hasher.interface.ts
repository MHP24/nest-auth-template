export interface HasherAdapter {
  hash(password: string): Promise<string>;
  compareHash(password: string, hash: string): Promise<boolean>;
}
