import * as bcrypt from 'bcrypt';

export async function getHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

//-- Проверка соответствия пароля его хэшу --//
export async function isPasswordCorrect(
  password: string,
  hash: string,
): Promise<boolean> {
  //-- Сравнение введенного пароля с хэшем, сохраненным в базе данных --//
  return await bcrypt.compare(password, hash);
}
