/* لایه داده نسخه نمایشی؛ برای اتصال بک‌اند در آینده، منطق ذخیره‌سازی را در همین فایل جایگزین کنید. */
const Store = (() => {
  const KEY = "elaro_demo_v1";
  const work = {days:[6,0,1,2,3,4], start:540, end:1020, breakStart:780, breakEnd:840, slotStep:30};
  const seed = {
    services: [
  {
    id: 1,
    cat: "پوست",
    name: "پاکسازی و فیشیال پوست",
    desc: "پاکسازی عمیق و مراقبت متناسب با نوع پوست",
    price: 1200000,
    duration: 60,
    doctors: [1, 2],
    image: "images4.jpg"
  },
  {
    id: 2,
    cat: "لیزر",
    name: "لیزر موهای زائد",
    desc: "خدمات لیزر با برنامه‌ریزی متناسب با مراجعه‌کننده",
    price: 1800000,
    duration: 45,
    doctors: [1, 2],
    image: "images5.jpg"
  },
  {
    id: 3,
    cat: "مو",
    name: "مزوتراپی مو",
    desc: "مشاوره و مراقبت تخصصی مو",
    price: 2400000,
    duration: 45,
    doctors: [3],
    image: "images6.jpg"
  },
  {
    id: 4,
    cat: "زیبایی",
    name: "مشاوره زیبایی",
    desc: "بررسی نیازها و ارائه پیشنهاد تخصصی",
    price: 400000,
    duration: 30,
    doctors: [1, 2, 3],
    image: "images7.jpg"
  },
  {
    id: 5,
    cat: "زیبایی",
    name: "مشاوره تزریقات",
    desc: "جلسه مشاوره پیش از خدمات زیبایی",
    price: 500000,
    duration: 30,
    doctors: [2],
    image: "images8.jpg"
  },
  {
    id: 6,
    cat: "پوست",
    name: "بررسی تخصصی پوست",
    desc: "ارزیابی اولیه و پیشنهاد روتین مراقبتی",
    price: 650000,
    duration: 30,
    doctors: [1, 2],
    image: "images9.jpg"
  }
],
 doctors: [
  {
    id: 1,
    name: "دکتر مریم صالحی",
    specialty: "متخصص پوست و لیزر",
    experience: 10,
    bio: "ارائه مشاوره و برنامه مراقبتی متناسب با نوع پوست و نیاز هر مراجعه‌کننده.",
    focus: "ارزیابی پوست، مراقبت‌های پوستی و خدمات لیزر",
    education: "پزشک؛ اطلاعات مدرک تخصصی باید توسط کلینیک تکمیل شود",
    image: "images.jpg",
    active: true,
    schedule: work
  },
  {
    id: 2,
    name: "دکتر نیلوفر امینی",
    specialty: "پزشک زیبایی",
    experience: 8,
    bio: "تمرکز بر مشاوره زیبایی، بررسی تناسب خدمات و انتخاب رویکردی طبیعی.",
    focus: "مشاوره زیبایی و مراقبت‌های غیرتهاجمی",
    education: "پزشک؛ اطلاعات مدرک تخصصی باید توسط کلینیک تکمیل شود",
    image: "images2.jpg",
    active: true,
    schedule: work
  },
  {
    id: 3,
    name: "دکتر سارا کیانی",
    specialty: "متخصص مو",
    experience: 9,
    bio: "ارزیابی وضعیت مو و ارائه پیشنهادهای مراقبتی متناسب با شرایط مراجعه‌کننده.",
    focus: "ارزیابی و مراقبت‌های مرتبط با مو",
    education: "متخصص؛ اطلاعات مدرک و دانشگاه باید توسط کلینیک تکمیل شود",
    image: "images3..jpg",
    active: true,
    schedule: work
  }
],
    appointments:[],
    settings:{name:"ELARO",phone:"۰۲۱-۰۰۰۰۰۰۰۰",address:"آدرس نمونه کلینیک – قابل ویرایش",hours:"شنبه تا پنج‌شنبه، ساعت ۹ تا ۱۷",cancelHours:6}
  };
  function read(){try{const value=JSON.parse(localStorage.getItem(KEY));if(value&&value.services&&value.doctors&&value.appointments)return value;}catch(e){}const fresh=structuredClone(seed);write(fresh);return fresh;}
  function write(data){localStorage.setItem(KEY,JSON.stringify(data));}
  return {
    all:read,
    get(key){return read()[key]},
    set(key,value){const data=read();data[key]=value;write(data)},
    add(key,item){const data=read();item.id=Math.max(0,...data[key].map(x=>Number(x.id)||0))+1;data[key].push(item);write(data);return item;},
    update(key,id,changes){const data=read(),item=data[key].find(x=>x.id===Number(id));if(item)Object.assign(item,changes);write(data);return item;},
    remove(key,id){const data=read();data[key]=data[key].filter(x=>x.id!==Number(id));write(data)},
    reset(){localStorage.removeItem(KEY);return read()}
  };
})();