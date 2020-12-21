const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

function truncateText(text, length) {
  if (text.length >= length) {
    text = text.substring(0, length) + "...";
  }
  return text;
}

const toTime = (s) => {
  var minute = formatNumber(parseInt(s / 60));
  var sedonds = formatNumber(parseInt(s % 60));
  return minute + ":" + sedonds;
};

module.exports = {
  formatTime: formatTime,
  truncateText: truncateText,
  toTime: toTime,
};
