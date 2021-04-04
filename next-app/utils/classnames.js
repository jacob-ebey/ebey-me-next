export default function classnames(...classes) {
  return classes.filter((cn) => typeof cn === "string").join(" ");
}
