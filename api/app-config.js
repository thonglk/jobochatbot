import config from 'config';

const FIRE_BASE = {
  "apiKey": "AIzaSyC1UNLtAqU5uwOMjHEQnCdvw4K0A93hfsA",
  "authDomain": "jobo-app.firebaseapp.com",
  "databaseURL": "https://jobo-app.firebaseio.com",
  "projectId": "jobo-app",
  "storageBucket": "jobo-app.appspot.com",
  "messagingSenderId": "484089476261"
}

const FIRE_BASE_ADMIN = {
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

/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error("Missing config values");
  process.exit(1);
}

const CONFIG = {
  'UpdateAt': "2017-04-10T04:44:21.253Z",
  'Location': false,
  'WEBURL': 'https://joboapp.com',
  "APIURL": 'https://jobohihi.herokuapp.com',
  'FCM_KEY': "AAAArk3qIB4:APA91bEWFyuKiFqLt4UIrjUxLbduQCWJB4ACptTtgAovz4CKrMdonsS3jt06cfD9gGOQr3qtymBmKrsHSzGhqyJ_UWrrEbA4YheznlqYjsCBp_12bNPFSBepqg_qrxwdYxX_IcT9ne5z6s02I2mu2boy3VTN3lGPYg",
  "APIKey": 'AIzaSyATOX9rL_ULV-Q_e2kImu9wYgK2AToOteQ',
  "StatusChat": {
    0: "Đã gửi",
    1: "Đã xem"
  },
  "action": {
    "autoLogin": "tự động đăng nhập",
    "buy": "mua gói",
    "chat": "chat",
    "close": "đã offline",
    "confirmBuy": "xác nhận mua",
    "createAccount": "tạo tài khoản",
    "createNewStore": "tạo thêm cửa hàng",
    "createProfile": "tạo profile",
    "updateProfile": "cập nhật profile",
    "createStore": "tạo cửa hàng",
    "dislike": "ghét",
    "filter": "lọc",
    "filterMore": "lọc nâng cao",
    "like": "thích",
    "login": "đăng nhập",
    "match": "tương hợp",
    "open": "đã online",
    "register": "đăng ký",
    "updateStore": "cập nhật store",
    "viewChat": "vào page chat",
    "viewPricing": "vào bảng giá",
    "viewProfile": "xem hồ sơ",
    "viewSetting": "vào cài đặt",
    "viewStore": "xem cửa hàng",
    "getToken": "lấy token"
  },

  "data": {
    "industry": {
      "airlines": "Hàng không/ Sân bay",
      "beauty_salon": "Thẩm mỹ viện",
      "education_centre": "Trung tâm đào tạo",
      "golf_course": "Sân Golf",
      "gym": "Thể hình/ phòng tập",
      "karaoke": "Karaoke",
      "lodging": "Khách sạn/ Khu căn hộ",
      "real_estate": "Dự án BĐS/ Quản lý tòa nhà",
      "resort": "Resort/ Khu Du lịch",
      "restaurant_bar": "Nhà hàng/ Bar/ Pub",
      "supermarket_cinema": "Siêu thị/ Rạp phim",
      "travel_agency": "Công ty Du lịch/phòng vé",
      "store": "Cửa hàng/Bán lẻ",
      "other": "Khác",

    },
    "job": {
      "pg": "PG/Sự kiện",
      "actor": "Diễn viên/Casting",
      "administration": "Hành chính/ Nhân sự",
      "cabin_crew": "Tiếp viên hàng không",
      "cook": "Đầu bếp",
      "fashion": "Người mẫu/Thời trang",
      "financing_accounting": "Tài chính / Kế toán",
      "manager": "Quản lý điều hành",
      "marketing_pr": "Marketing/ PR",
      "mc_event": "MC/Sân khấu",
      "receptionist_cashier": "Lễ tân/ Thu ngân",
      "sale": "Bán hàng/sale",
      "secretary": "Trợ lý/Thư ký",
      "server": "Phục vụ",
      "designer": "Designer",
      "other": "Khác"
    },
    "languages": {
      "english": "Tiếng Anh",
      "chinese": "Tiếng Trung",
      "french": "Tiếng Pháp",
      "germain": "Đức ",
      "italian": "Ý",
      "japanese": "Tiếng Nhật",
      "korean": "Tiếng Hàn",
      "others ": "Khác",
      "portuguese ": "Bồ Đào Nha",
      "spanish": "Tây Ban Nha",
      "thai": "Thái Lan"
    },
    "time": {
      "morning": "Sáng",
      "noon": "Trưa",
      "afternoon": "Chiều",
      "evening": "Tối"
    },
    "working_type": {
      "fulltime": "Toàn thời gian",
      "parttime": "Bán thời gian",
      "seasonal": "Thời vụ"
    },

    "sex": {
      "male": "Nam",
      "female": "Nữ",
      "": "Không yêu cầu"
    },
    "sort": {
      "match": "Phù hợp nhất",
      "createdAt": "Thời gian",
      "distance": "Khoảng cách",
      "viewed": "Lượt xem",
      "rate": "Đánh giá",
      "feature": "Nổi bật"


    },
    "dataContentType": {
      "job": "Công việc",
      "store": "Thương hiệu"
    },
    "convertIns": {
      "store": {
        "bicycle_store": true,
        "book_store": true,
        "clothing_store": true,
        "convenience_store": true,
        "electronics_store": true,
        "florist": true,
        "furniture_store": true,
        "hardware_store": true,
        "home_goods_store": true,
        "jewelry_store": true,
        "laundry": true,
        "liquor_store": true,
        "meal_takeaway": true,
        "shoe_store": true,
        "pharmacy": true,
        "pet_store": true,
        "hair_care": true,
        "car_rental": true,
        "car_repair": true,
        "car_wash": true,
        "movie_rental": true,
        "store": true
      },
      "lodging": {
        "lodging": true
      },
      "restaurant_bar": {
        "bar": true,

        "cafe": true,
        "night_club": true,
        "restaurant": true
      },
      "resort": {
        "campground": true,
        "amusement_park": true,
        "aquarium": true,
        "park": true,
        "rv_park": true,
        "zoo": true
      },
      "beauty_salon": {
        "beauty_salon": true,
        "spa": true,
        "physiotherapist": true
      },
      "supermarket_cinema": {
        "movie_theater": true,
        "shopping_mall": true
      },
      "real_estate": {
        "art_gallery": true,
        "library": true,
        "museum": true,
        "real_estate_agency": true,
        "stadium": true
      },
      "education_centre": {
        "school": true,
        "university": true
      },
      "unique": {
        "gym": true,
        "travel_agency": true,
        "airport": true,
        "lodging": true
      }
    }
  },
  "chatlist": {
    0: "Tất cả ứng viên",
    1: "Đã gửi lời mời",
    2: "Đã ứng tuyển",
    3: "Đã tương hợp"
  },
  "chatlistUser": {
    0: "Tất cả công việc",
    1: "Đã ứng tuyển",
    2: "Đã tuyển bạn",
    3: "Đã tương hợp"
  },
  "review": {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Ổn',
    4: 'Tốt',
    5: 'Xuất xắc'
  },
  "pack": {
    1: {
      "name": "Basic",
      "price": "100.000 đ/tháng"
    },
    2: {
      "name": "Premium",
      "price": "300.000 đ/tháng"
    },
    3: {
      "name": "Power",
      "price": "1.000.000 đ/tháng"
    }
  }
}

module.exports = { CONFIG, APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKEN, SERVER_URL, FIRE_BASE, FIRE_BASE_ADMIN };