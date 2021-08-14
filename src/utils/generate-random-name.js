import Names from "./nameList.json";

const generateRandomName = () => {
  return (
    Names.firstName[Math.floor(Math.random() * Names.firstName.length)] + ' ' +
    Names.lastName[Math.floor(Math.random() * Names.lastName.length)]
  );
};
export default generateRandomName;