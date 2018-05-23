export interface IShowroomElement {
	name: string;
	tags: string[];
	siteurl?: string;
	descFr?: string;
	descEn?: string;
	image?: string;
}

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export interface IIthoughtsEnvironment {
	production: boolean;
	app: {
		port: number,
		url: string,
		recaptchaKey: string,
	};
	api: {
		port: number,
		url: string
	};
	showroom: {
        sites: IShowroomElement[],
        libs: IShowroomElement[],
    };
}

export const environment: {production: boolean, showroom: {
    sites: IShowroomElement[],
    libs: IShowroomElement[],
}} = {
	production: false,
	showroom: {
        sites: [
            {
                name: 'iThoughts',
                tags: ['Angular2', 'Pixi.js', 'NodeJS'],
                siteurl: 'https://ithoughts.io',
                descFr: 'Site corporate responsive avec Angular2 & Diaspora.',
                descEn: '',
                image: '/assets/images/showroom/ithoughts.png',
            },
            {
                name: 'Self 3D Print',
                tags: ['Symfony4'],
                siteurl: 'https://self3dprint.ithoughts.io',
                descFr: `Vente en ligne d\'objets imprimés en 3D, où les utilisateurs peuvent imprimer leurs propres modèles.<br/>
En développement.`,
                descEn: '',
                image: '/assets/images/showroom/self3dprint.png',
            },
            {
                name: 'GerkinDevelopment',
                tags: ['Wordpress'],
                siteurl: 'https://www.gerkindevelopment.net',
                descFr: `Le blog d\'Alexandre Germain (Gerkin), basé sur un WordPress. La plupart de ses projets y sont évoqués, et
 quelques démos de plugins y sont également présentes. Le glossaire est basé sur
 <a href="/showroom?name=${encodeURIComponent('iThoughts Tooltip Glossary')}">iThoughts Tooltip Glossary</a>.`,
                descEn: '',
                image: '/assets/images/showroom/gerkindevelopment.png',
            },
            {
                name: 'Art Aux Murs',
                tags: ['Prestashop'],
                siteurl: 'https://www.art-aux-murs.fr/',
                descFr: 'Vente en ligne de tableaux de fractales ou abstraits.',
                descEn: '',
                image: '/assets/images/showroom/artauxmurs.png',
            },
            {
                name: 'PasseTonCode',
                tags: ['Symfony4'],
                siteurl: 'https://passetoncode.ithoughts.io',
                descFr: 'Site de partage de code pour développeurs perfectionnistes. En développement.',
                descEn: '',
                image: '/assets/images/showroom/passetoncode.png',
            },
        ],
        libs: [
            {
                name: 'Diaspora',
                tags: ['NodeJS'],
            },
            {
                name: 'iThoughts Tooltip Glossary',
                tags: ['Wordpress'],
                image: 'https://ps.w.org/ithoughts-tooltip-glossary/assets/icon.svg?rev=1279756',
                descFr: 'Plugin Wordpress pour gérer des glossaires et des infobulles.',
                siteurl: 'https://wordpress.org/plugins/ithoughts-tooltip-glossary/'
            },
        ],
    }
};
