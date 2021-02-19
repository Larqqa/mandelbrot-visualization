#include <stdio.h>

int add(int a, int b) {
	return a + b;
}

int substract(int a, int b) {
	return a - b;
}

int multiply(int a, int b) {
	return a * b;
}

int divide(int a, int b) {
	return a / b;
}

int * fib(int n) {
  static int str[10];
  int first = 0, second = 1, next, c;

  for (c = 0; c < n; c++)
  {
    if (c <= 1)
      next = c;
    else
    {
      next = first + second;
      first = second;
      second = next;
    }

    str[c] = next;
  }

  return str;
}
