Util = {
  selectRandom: function (collection) {
    if (collection.length == 0) {
      return undefined;
    }

    return collection[Math.floor(Math.random() * collection.length)];
  },
};
