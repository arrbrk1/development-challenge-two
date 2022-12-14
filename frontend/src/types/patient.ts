export interface Patient {
  id?: string;
  name: string;
  email: string;
  address: string;
  birth_date: string;

  [key: string]: any;
}
