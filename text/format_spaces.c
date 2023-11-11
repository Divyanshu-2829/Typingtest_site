#include <stdio.h>

#define NONSPACE 'a'


int is_space(char c) {
	return c == ' ' || c == '\n' || c == '\t';
}

void remove_spaces(FILE *file_from, FILE *file_to)
{
	int c, prev;

	prev = NONSPACE;
	while((c = getc(file_from)) != EOF) {
		if(! (is_space(prev) && is_space(c)))
			putc(c, file_to);
		prev = c;
	}
}


void main()
{
	FILE *from = fopen("typing.txt", "r");
	FILE *to = fopen("formatted.txt", "w");

	remove_spaces(from, to);

	fclose(from);
	fclose(to);
}
