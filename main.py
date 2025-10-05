
def print_christmas_tree(height):
    if height <= 0:
        return
    for i in range(1, height + 1):
        spaces = " " * (height - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)

print_christmas_tree(5)