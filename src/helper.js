let userID;
let pwd;

export const getAvatar = (index) => {
  const items = [
    'lorelei',
    'micah',
    'avataaars',
    'personas',
    'open-peeps',
    'notionists',
    'miniavs',
    'adventurer',
    'big-ears',
    'big-smile',
  ];
  return items[index >= items.length ? 0 : index];
};

export const getCurrentUser = () => {
  return { userID, pwd, avatar: getAvatar(0) };
};

export const setCurrentUser = ({ _userID, _pwd }) => {
  userID = _userID;
  pwd = _pwd;
};

export const getRandomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export async function downloadFile({ url }) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf',
    },
  });

  const fileName = getRandomString(10) + '.pdf';
  const blob = await res.blob();

  const newUrl = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = newUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
}
