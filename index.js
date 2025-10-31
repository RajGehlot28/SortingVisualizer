let randomize_array = document.getElementById("randomize_array_btn");
let sort_btn = document.getElementById("sort_btn");
let bars_container = document.getElementById("bars_container");
let select_algo = document.getElementById("algo");
let speed = document.getElementById("speed");
let slider = document.getElementById("slider");

let numOfBars = slider.value;
let heightFactor = 4;
let speedFactor = 100;
let unsorted_array = [];
let sorting = false;

// create random number
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create random array
function createRandomArray() {
  let arr = [];
  for (let i = 0; i < numOfBars; i++) {
    arr.push(randomNum(1, numOfBars));
  }
  return arr;
}

// display bars
function renderBars(arr) {
  bars_container.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = arr[i] * heightFactor + "px";
    bars_container.appendChild(bar);
  }
}

// delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// swap function
async function swap(arr, i, j, bars) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;

  bars[i].style.height = arr[i] * heightFactor + "px";
  bars[j].style.height = arr[j] * heightFactor + "px";
  bars[i].style.backgroundColor = "red";
  bars[j].style.backgroundColor = "red";
  await sleep(speedFactor);
  bars[i].style.backgroundColor = "#9AD0EC";
  bars[j].style.backgroundColor = "#9AD0EC";
}

// -------- BUBBLE SORT --------
async function bubbleSort(arr) {
  let bars = document.getElementsByClassName("bar");
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        await swap(arr, j, j + 1, bars);
      }
    }
    bars[arr.length - i - 1].style.backgroundColor = "#A3EBB1";
  }
  bars[0].style.backgroundColor = "#A3EBB1";
}

// -------- INSERTION SORT --------
async function insertionSort(arr) {
  let bars = document.getElementsByClassName("bar");
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      bars[j + 1].style.height = arr[j + 1] * heightFactor + "px";
      bars[j + 1].style.backgroundColor = "red";
      await sleep(speedFactor);
      j--;
    }
    arr[j + 1] = key;
    bars[j + 1].style.height = key * heightFactor + "px";
    bars[j + 1].style.backgroundColor = "#A3EBB1";
  }
}

// -------- SELECTION SORT --------
async function selectionSort(arr) {
  let bars = document.getElementsByClassName("bar");
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    bars[i].style.backgroundColor = "#FFB347";

    for (let j = i + 1; j < arr.length; j++) {
      bars[j].style.backgroundColor = "#FF6B6B";
      await sleep(speedFactor);
      if (arr[j] < arr[minIndex]) {
        if (minIndex !== i) bars[minIndex].style.backgroundColor = "#9AD0EC";
        minIndex = j;
      }
      bars[j].style.backgroundColor = "#9AD0EC";
    }

    await swap(arr, i, minIndex, bars);
    bars[i].style.backgroundColor = "#A3EBB1";
  }
  bars[bars.length - 1].style.backgroundColor = "#A3EBB1";
}

// -------- HEAP SORT --------
async function heapify(arr, n, i, bars) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest != i) {
    await swap(arr, i, largest, bars);
    await heapify(arr, n, largest, bars);
  }
}

async function heapSort(arr) {
  let bars = document.getElementsByClassName("bar");
  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, bars);
  }

  for (let i = n - 1; i > 0; i--) {
    await swap(arr, 0, i, bars);
    bars[i].style.backgroundColor = "#A3EBB1";
    await heapify(arr, i, 0, bars);
  }
  bars[0].style.backgroundColor = "#A3EBB1";
}

// -------- MERGE SORT --------
async function merge(arr, l, m, r, bars) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = [];
  let R = [];

  for (let i = 0; i < n1; i++) L.push(arr[l + i]);
  for (let j = 0; j < n2; j++) R.push(arr[m + 1 + j]);

  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    bars[k].style.height = arr[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "#A3EBB1";
    await sleep(speedFactor);
    k++;
  }
  while (i < n1) {
    arr[k] = L[i];
    bars[k].style.height = arr[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "#A3EBB1";
    await sleep(speedFactor);
    i++;
    k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    bars[k].style.height = arr[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "#A3EBB1";
    await sleep(speedFactor);
    j++;
    k++;
  }
}

async function mergeSort(arr, l, r, bars) {
  if (l >= r) return;
  let m = l + Math.floor((r - l) / 2);
  await mergeSort(arr, l, m, bars);
  await mergeSort(arr, m + 1, r, bars);
  await merge(arr, l, m, r, bars);
}

// -------- QUICK SORT --------
async function partition(arr, low, high, bars) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      await swap(arr, i, j, bars);
    }
  }
  await swap(arr, i + 1, high, bars);
  return i + 1;
}

async function quickSort(arr, low, high, bars) {
  if (low < high) {
    let pi = await partition(arr, low, high, bars);
    await quickSort(arr, low, pi - 1, bars);
    await quickSort(arr, pi + 1, high, bars);
  }
}

// -------- EVENT HANDLERS --------
slider.addEventListener("input", function () {
  numOfBars = slider.value;
  unsorted_array = createRandomArray();
  renderBars(unsorted_array);
});

speed.addEventListener("change", (e) => {
  speedFactor = parseInt(e.target.value);
});

randomize_array.addEventListener("click", function () {
  if (sorting) return;
  unsorted_array = createRandomArray();
  renderBars(unsorted_array);
});

sort_btn.addEventListener("click", async function () {
  if (sorting) return;
  sorting = true;
  let bars = document.getElementsByClassName("bar");
  let algo = select_algo.value;

  if (algo === "bubble") await bubbleSort(unsorted_array);
  else if (algo === "insertion") await insertionSort(unsorted_array);
  else if (algo === "selection") await selectionSort(unsorted_array);
  else if (algo === "heap") await heapSort(unsorted_array);
  else if (algo === "merge") await mergeSort(unsorted_array, 0, unsorted_array.length - 1, bars);
  else if (algo === "quick") await quickSort(unsorted_array, 0, unsorted_array.length - 1, bars);

  sorting = false;
});

document.addEventListener("DOMContentLoaded", function () {
  unsorted_array = createRandomArray();
  renderBars(unsorted_array);
});
