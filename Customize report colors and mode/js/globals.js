// js/globals.js
// ----------------------------------------------------------------------------
// Manually inject your embed settings:

// 1) Paste the full JWT string you printed in PowerShell (keep the quotes!):
const EMBED_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYWIxOTRlMDEtNmRjNy00YzZhLWJiYjEtNjhjMTJjNzQ0Yjk3LyIsImlhdCI6MTc1MDAyOTM1MSwibmJmIjoxNzUwMDI5MzUxLCJleHAiOjE3NTAwMzMyNTEsImFpbyI6ImsyUmdZREE2dWxETXoyN3JKazBkVStaTmxadVRBQT09IiwiYXBwaWQiOiJhODhhMTlhNC0yY2RhLTQ1NmMtOWZkYy05MjE4ZDAwMjdlZTIiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hYjE5NGUwMS02ZGM3LTRjNmEtYmJiMS02OGMxMmM3NDRiOTcvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI5NTFjYzI1Ny00YTNiLTQyMDgtOTIyNi0xODI0M2NiOGIxMTYiLCJyaCI6IjEuQVRZQUFVNFpxOGR0YWt5N3NXakJMSFJMbHdrQUFBQUFBQUFBd0FBQUFBQUFBQUEyQUFBMkFBLiIsInN1YiI6Ijk1MWNjMjU3LTRhM2ItNDIwOC05MjI2LTE4MjQzY2I4YjExNiIsInRpZCI6ImFiMTk0ZTAxLTZkYzctNGM2YS1iYmIxLTY4YzEyYzc0NGI5NyIsInV0aSI6ImE2VFNHRHF0M1VPNmcybXhkc0FtQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfZnRkIjoibVQ5RjFrems5ZjdHLWVrUllBYk5DeXhNejFQY2MwU09XS21XN3pSRnpLOEJkWE51YjNKMGFDMWtjMjF6IiwieG1zX2lkcmVsIjoiNyAyIiwieG1zX3JkIjoiMC40MkxsWUJKaU5CTVM0V0FYRXRETWZMZ3JqWC1CejZTZHo1UmVScy1TQklweUNnbjQ4YTZmcG5CbHR0UE9PVXlaVTNmTTl3S0tjZ2dKY0RKQXdBRW9EUUEifQ.Qg7FZATwSDh6hRXd_GF_MGldR5Ab--UJj93zEE5DqqRWZvAng_KG8rTs-NVzUKoxp-x6nrGR0POL-xNUwftnrU8-BDU_wibDl0XBwE-aO_k4z6M5Y7_koyGaqPgTmAxN_IhBeYsCHPNQIqKP-oSaNW6e2Qfj-fmC2xAtySaybyXg11fARflD3NmjaKYqL-NohRXma9tT8VJT1h2nSrwQO1Ad6zlDn8rlIJrTIJI9NswyU7KQ9yurrMMxiRSZYGkaH_biRwqckb2f84VSz4OMDMn_NEPBCp6P3goMu1tjy1bhKl2RWSoLfrKUTdp2nQclRy7H_TvY1Mw3bTBKkpMUqw";

// 2) The embedUrl from your reportList.json entry:
const EMBED_URL   = "https://app.powerbi.com/reportEmbed?reportId=69efae40-1fb2-4f69-936d-4e6d9c6d40fd&autoAuth=true&ctid=ab194e01-6dc7-4c6a-bbb1-68c12c744b97";

// 3) The GUID of the report:
const REPORT_ID   = "69efae40-1fb2-4f69-936d-4e6d9c6d40fd";

// Expose configuration globally:
window.reportConfig = {
  accessToken: EMBED_TOKEN,
  embedUrl:    EMBED_URL,
  reportId:    REPORT_ID
};

// Since we’re not loading this asynchronously, resolve immediately:
window.configReady = Promise.resolve();

