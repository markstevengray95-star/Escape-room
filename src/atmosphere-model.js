// Design profiles. Textures are created locally, without external image dependencies.
export const visualThemes={
 lab:{floor:'tile',wall:'panel',ceiling:'panel',ambient:0xcdebf6,ground:0x647a83,hemi:1.55,key:1.15,exposure:1.12,fixture:0xd7f1ff,light:0xd9efff,power:20,emergency:12,fog:0x34484f,near:18,far:42,accent:0x70c7b6,metal:.12},
 space:{floor:'deck',wall:'hull',ceiling:'hull',ambient:0x9cbde5,ground:0x35485d,hemi:1.35,key:.95,exposure:1.18,fixture:0x9ac7ff,light:0xb2d7ff,power:23,emergency:10,fog:0x203044,near:16,far:40,accent:0x69b5ee,metal:.45},
 bio:{floor:'resin',wall:'panel',ceiling:'panel',ambient:0xccf0dc,ground:0x46635b,hemi:1.50,key:1.0,exposure:1.12,fixture:0xc7ffe0,light:0xc9f5df,power:19,emergency:12,fog:0x38564e,near:17,far:40,accent:0x86d6a4,metal:.12},
 chem:{floor:'tile',wall:'brick',ceiling:'panel',ambient:0xf3e0c3,ground:0x6c6354,hemi:1.55,key:1.05,exposure:1.08,fixture:0xffe7c0,light:0xffebd4,power:21,emergency:12,fog:0x504b43,near:18,far:42,accent:0xdfb262,metal:.16},
 blackout:{floor:'concrete',wall:'concrete',ceiling:'deck',ambient:0xb9c2ce,ground:0x4b4640,hemi:1.20,key:.85,exposure:1.21,fixture:0xffbe72,light:0xffd29a,power:23,emergency:9,fog:0x31363b,near:17,far:44,accent:0xd7a450,metal:.30},
 tomb:{floor:'stone',wall:'stone',ceiling:'stone',ambient:0xf8d6a2,ground:0x64513c,hemi:1.30,key:.85,exposure:1.13,fixture:0xffc174,light:0xffd09a,power:17,emergency:11,fog:0x514131,near:14,far:38,accent:0xb59660,metal:0}
};
export const visualTheme=id=>visualThemes[id]||visualThemes.lab;
export const graphicsDetail=quality=>({low:{bump:false,reflection:false,details:false},standard:{bump:true,reflection:true,details:true},high:{bump:true,reflection:true,details:true}}[quality]||{bump:true,reflection:true,details:true});
export function lightLevel(id,power){const t=visualTheme(id);return power?t.power:t.emergency;}
