const FIRE_BASE_ADMIN = {
  development: {
    databaseURL: "https://jobo-app.firebaseio.com",
    cert: {
      "type": "service_account",
      "project_id": "jobo-app",
      "private_key_id": "d25f0015427c296f7b8da7714d08a79bc79e4aa5",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkcwIss8aUJS9q\nR6Lb1Y5mzt0oHSS6UB/V8ojH+LpxOB1w2s9cIFZqquNZ/dAXoZLxDknTvK4fo3n0\nE/D4Nn6h1JxGGr2Xrmx903T7x2xlJTESI2gOVzi4kFC13r1v61kneniEvyErncNG\nKGxi4cg10e7EsUMr6kPXlEzO+vnj4t06VhYAe7SL4zzb5lRayDIipm4xJbqTQVWi\n4GayDJWKnErXt8Cnor8adqbDZGuJhQ7/Y6rKS8skxTES60Jeo2Tru8d66FKBm01c\nWXGWwWA0nRuKxNFk5wLDnRzg0eNUF5oGLGXdjX3QuNklXFl8j7GumUknkTqxkGbG\nVzjMsSZ9AgMBAAECggEAEl2BtapSGANbGzxq1LAx2gtqKWuvyVrfY05Vtjdx4ukI\naK0XEUvPOtRg1ZEB51G1DlSxLANbUs839GkxtRao57vNxAqCd+kT1q2B2Ah6c4VG\nyKbJnShifkInsVfxwgj/iOglg3Ww56UTxMcI67YZXOFYEAFX5hSghPfb6BWhSLDE\nfaIFfy4zLdsP0C9MgNcV+NzzsDD0NMRksj6lBGsohrogPx2dl3qrzqlQbHM95aW7\nAFrTRR1hF+SH4cf86VQWe8XvIpWygr0rNU18gIai76/2H7qtHY7nYv78ZIbCxdpz\nNXJUl6ZWC2RUALNHakFqTLjjgr2xW7et7BrptGJ9JQKBgQDOsdWDuyshkMNKrKjL\nwW3Fe6HMKu2sY5qum0tIm1tLWSx/F9h4Hr/lDIcBO1k+er3SaW023fomrhTf3g2A\nq/pzAaw1q3cTUyHecJUu7zLABW3Z23ULCoYvfh7/5DJJdI24tY3vwafClSn4N/ON\nvsgEpEZQ0jBZKVwvUVX1TZlVHwKBgQDLrWKyMrej34TnDZaP54rOCAxX+NXKMyC1\nI2CtWqXIvtzbRWLPDgBK8zWHUbNM7RKyAIuKNLMVFN60iBUIIaS4Iutn9YnnDt2u\nNrL0D0ugspk1u7xQtzUs4x98UUN1wUZ59cx0kha14/8bg3zeb4Ghs+xWim6fp7ej\nuEW4oCPU4wKBgDT3STmaivDtAb5vBEpCZPjIN6v0DDeyxn6b+OzAMuLaFRb0a1pM\ntuvhC+963+Gs3lu+/Gek9mdXEK5VXqxsZZ92/EQ8jiT7lqBDxVbjoOOoAIBlRlbv\n+XbOIO998Iz2OyLsE1UvEOhCBSFAZT8bdnIKDqLDWfRfLupJM3fKzNINAoGBAI7a\np1Sw+dh4V3DvOODp15M2VeIF530QayphC9fKsmigZatteSYcfdwTxUGJ7iZQSUKL\n21MuL0TkBGe+4nF3l16HL3EU6IolBRrBxrYjXDnzyj3D1QsP1L4M9vJs1NHso4+6\n9JH2PPOKXE1h5dzlfJh755GzOm/EZKrx/gTGXRtdAoGAUraZXIX64oKyMONCz54V\ndoh8zwbxJoP8QYvxu4PNJ5TOFjbE/pqS3axB/DEUFI61VH6buZXzk7GO8VdKPMmc\nu+UzfGapnUOrySpd5e1goj1rFnQRI/sH35ahiKQF1kqmxo7yHDOgkVP8/YY+ixbp\ns2IG1/1q2ueBfeuSzGL75Pg=\n-----END PRIVATE KEY-----\n",
      "client_email": "jobo-app@appspot.gserviceaccount.com",
      "client_id": "104411682699978595454",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/jobo-app%40appspot.gserviceaccount.com"
    }
  },
  production: {
    databaseURL: "https://jobo-b8204.firebaseio.com",
    cert: {
      "type": "service_account",
      "project_id": "jobo-b8204",
      "private_key_id": "14ea0b26388024fd4e0aef26837d779e6360f70f",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6hhT4dkFvQ9dx\n+LtdyCt69WV+ffL4d0qsFUaAZftHt4npIlyqKNImSWvtOyDYHFpwSosL99+Va1/G\n6EeKKvJgdH8iCEApaxCyCRM1oZuXNVfDc3sH39NJoTpilcNmEbDteTOUN1blpqry\nnIG476P7NxXanly/ltrJwP2iLn4fQHGrtXohEsx3eChPL1fMsOxA6YfXhPQlGrUz\nG0wSvxE9iz8T2PKQJrzXxzcKCYAD9lFViHYEdNMnv6T3MdVVthAVD5v5d092Mlah\nxqNmBpfaqVWpYnlGrrEH0czxip0ZVvGuAU6gvvfxOwhrtmwCdpJaQzhm4FaWlgrH\n94oCWerTAgMBAAECggEAQ28FNtyeBIlc4y3/I0UifxYoBuanCHAsVXFtpy73fTKc\nT+Zl5PjUHRZvR/mYArmhcrZodb+8HAuROVqxvoCPVxLXAalE9RRpmUwRn1KZaz3U\nSGvAH5UqkJSTBKBLX+PmeLxYSu4E4wryA7tUZNVyjfiY1IxrULLLz6QPrmorm8Uz\nvrb/NpNO7j1YiCVVx6cQH0/PA/hQwlLFW6XL9+X7ATUuxUQI4sjwGjA9we9bfU3M\nNvcovUsMwLEPg3TaHVnaeDbpf8X0GHvUMgkpDmNrFQkwskKWCtsIMWB35f5Rh50B\nRpzEF8RDlv98i8GQeFCM/sWuI4pE8mAOQi+gvxAxpQKBgQD6OIAVTh5xYFlvk3+O\nSOM/CcqrM5Gatg36cOQ2W8HvWz6cEKjiueWmfPGxq/pfLOQzA3MMRWlH+UDC7nME\nq3gvGoWaja4dqlbpWt343icaKqeViuybB/y80fsuhLWATrN8bggq3OplCI+Jg5Bw\n75x8zE8Ib2XIbwx5Ok+gqzXERQKBgQC+1PSkcOhQYIHy1zUiMbS7Klxq95Mzodjz\noTt4YtvjMuJCguJ2Eo6Rlf3ArtxFh+3TTncnttM1LezNRdjdRZdhjwX1qH4LT5Jx\n5b6Cw4JycLy9GB7VWnIx9xw2yvBKk7ZyyQCzZA3YcHpngbl3mpyzGryPgoZX4vMN\njOETAEXANwKBgQCzpg8nvL+UrRVpS2AAewpU/yW4hzzZ9C3TCmx/Lp/txvgLutZW\nehuMzhYFdzE6VhO9IJPgUpGFMEqz6dlAmA+g2gzkayaAfAUMY8YM4Qr3+Xn6nxTD\nNhfaRXRu8K8TYO3yv1kz1Qqg4WWU2JXCz/XtkA6KQtiz8C7ndtsmwuXGdQKBgGT1\nZThaQ43CgP1ovcOJaIRctOgics4uIglCk6PtKUfZ87ocZJLy3lpHcCgwWniuoTPZ\nn1BzeOn5kf5HpaPq3VvPvudobMavIlr/oPqtVKYW3sNrr2RQpXmpslOKqfXKkAvK\nK4S8ulZ3q0p3ZxfPxHc8/eUuuMRmXRAeKDVVP5GhAoGAW+7NYzQpN5LTVh4XD7yR\nqPSwvYu8srmGB+spp8GO+1VJGYqNI9V35jTkbnZk3kJlYli72npBr96wnxUK/ln2\nOm50rCs+7AkbvzPGkmtMzcOCpstrs2GqtQz8UQGMpsMrlZ7g6lKG42r7DpQ8G/vj\n3Hg+Lu6M8x26b5mFimstO0Y=\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-q7ytj@jobo-b8204.iam.gserviceaccount.com",
      "client_id": "113764809503712074592",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q7ytj%40jobo-b8204.iam.gserviceaccount.com"
    }
  },
  config: {
    databaseURL: "https://jobfast-359da.firebaseio.com",
    cert: {
      "type": "service_account",
      "project_id": "jobfast-359da",
      "private_key_id": "faf771e474a27ed686df35ef37eba42836d1952e",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCq+hHcEgWbqtAM\nzpOBNCIedvSDHkrBqFh/+YjCdPda74C5fBOzbBr4n1Jnl0KQBCdF3+RU0f8psSf3\nIt8ByaPNzEnnU0/21Mbo6UewNh/01lrmIq8yC0LvbrCTsR4A6Kyz45yx0GiI9l+a\nZ17MyoaoiY/n0kr752PXGHdDVhH+n+v8zVCCwk0jyr4Ibsb8AThD2wXbspUn7yAK\n6aIProXCBs+KwXzw2h7ATQocfthzoVDyNQYIefueHPV2kMNno2CxCNBIzaD7Bw5s\nu3xElijONlP2z0O/3ehhTb8iVnYIpS9iUi8Qghoji8WgKX0JQNSGWKPIIZCq9fzM\n41geDzFXAgMBAAECggEAB8EgZDxxAqwO6YseR4Lcyp2XM1yBWXfQI7sRMniUQLc8\nvazcm+DwTDcK9BB5KrJK3FwY1/v6OE2E7tbRtHFiZigOG1lnoV3pyOXOTuCgNxOD\nEI2hfSyOPvEPPcjk/8zjCvmXbBJ0Be+JSyXFt+tg4MNJwo2CwcVZ0tyU3s9IMPsZ\nT4NEDAmiz0FsR897XqehGkZvUum6eYN05zdFNXHw33hhbp5iq3Bctxf+CNzSGMV7\n/Zra7MPYXCI2L2YO0fM6zUKScyYnpv185xKIQVp6DR9kFULr249utzJq3pDyJ3VL\n9A4Gd2HMhDGSNHgRF9OBIxDE8z2/3CRozP4P0rdEmQKBgQDxvevtjn98+PINQ6Gt\nJcu1cmA2OFXsoQzgvtLiSpGk7sezwrTohgompzg7yR9LSvwevAyMUoRRrrTYkNyp\npsIdhlazvnAMXpDrLlTKLw9e62iJME82KQcnQgqg5uKoCkqHS3GuolKE1nOEhGPK\nBvZmOQ+juFqMZ+cigGQslsquqwKBgQC1D6la+b437ol+OG8BXV8/EqHN1AUBIaHf\nwKIf2wFKPRqvWMm4Skg3/n43EcGnfdU36sCWrq/ydNrzci95U2D0HeqqNzqhOxFZ\nT/Zivd8mP8/0zpEupkJrOjVrB+C5B535E5PGRgcN93KYubxSAn9nC/rS31eWZrEQ\njaZYZC1YBQKBgQCCWF6C+6fAMdcJ0eK2IsABOQeplJy392qjMCEzRPPdE6b4RU8Y\nZVXJ27ZVfi9ygJ8Kz2iQrNmN1X7LmuhwTWszUkEjr9ZoxQCs3pF3ZwKJsrLt7e94\nC41A3LowYe3qn4nqA4Lrn7iQybUFygCoaTKokbHeHEQumsOk9ceNx0zH+wKBgF4L\n0YLQwC4bN82ZEIeb8VI4olTgMO1Cg+tOCqgTQJtIG+lCbBzOcK6tAPAnx/fw02Rl\nCj36ZKfCbMwQ3nndhjmmpHJfl5ORs9Q5RZhKWXNrp9/Xv++EKnG53W9Hu0FApJxw\nv8w4KYfmpN6RczEB3R0wSstneP5FPumDOgkll6vlAoGBAMPakXEejITjNomKaUBX\ngIxfTTBWuWoE3q78zLnmDUMBOaLX4e5b7Xi0e0do30MUChM+dxF6aDLQl0ycBW+Q\nCu5PXTkuKOjc9bLlqVX/vmbRiA3ebVDQaCoVw3ED+36g9tyFA3JMmNCo46nA6oiv\nOynT9HetkK43NU9HmFLB69QH\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-q1cj9@jobfast-359da.iam.gserviceaccount.com",
      "client_id": "117389239828615707572",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q1cj9%40jobfast-359da.iam.gserviceaccount.com"
    }
  }
}


module.exports = FIRE_BASE_ADMIN;