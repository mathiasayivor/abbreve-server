# ABBREVE-SERVER

This is just a simple prototype to demonstrate how we can translate full sentences using the existing abbreve db

## Installing

* Clone the repository to your local machine. E.g. `git clone https://github.com/mathiasayivor/abbreve-server`
* Install the dependencies. E.g. `cd abbreve-server && pnpm instal`

## Testing

* Start the server. E.g `pnpm start`
* Make a GET http request to the app with `sentence` query parameter set to the sentence you would like to translate.
E.g:

```bash
curl -X GET \
  'http://localhost:4040/api/translate?sentence=lgtm'
```
