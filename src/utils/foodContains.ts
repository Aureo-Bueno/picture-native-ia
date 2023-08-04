import { ItemProps } from '../components/Item/types';

export function foodContains(items: ItemProps[], foodName: string) {
  for(const item of items) {
    if (item.name.toLocaleLowerCase() === foodName.toLocaleLowerCase()) {
        return true;
    }
  }

  return false;
}