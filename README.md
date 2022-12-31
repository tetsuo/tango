# tango

textual syntax for the [mango](https://docs.couchdb.org/en/3.2.2-docs/api/database/find.html#selector-syntax) query language.

![Build](https://github.com/onur1/tango/actions/workflows/main.yml/badge.svg)

[Report a bug or suggest a feature](https://github.com/onur1/tango/issues)

## Syntax

tango expressions are based on the C syntax. Currently it supports basic comparison operators (`==`, `>`, `>=`, `<`, `<=`, `||`, `&&`) and parentheses for explicit operator precedence.

### Examples

Match documents whose "director" field has the value "Lars von Trier".

Tango:

```c
director == "Lars von trier"
```

Mango:

```json
{
  "director": "Lars von Trier"
}
```

`&&` (and) operator works as expected:

Tango:

```c
director == "Lars von Trier" && year >= 2010
```

Mango:

```json
{
  "$or": [
    {
      "director": {
        "$eq": "Lars von Trier"
      }
    }
    {
      "year": {
        "$gte": 2010
      }
    }
  ]
}
```

Use parentheses to create more complex queries.

Tango:

```c
(director === "Lars von Trier" && year >= 2010) || (name == "Paul" && location == "Boston")
```

Mango:

```json
{
  "$or": [
    {
      "$and": [
        {
          "=": {
            "$eq": "Lars von Trier"
          }
        },
        {
          "year": {
            "$gte": 2010
          }
        }
      ]
    },
    {
      "$and": [
        {
          "name": {
            "$eq": "Paul"
          }
        },
        {
          "location": {
            "$eq": "Boston"
          }
        }
      ]
    }
  ]
}
```
