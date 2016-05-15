# Fonsta: add fonts to your project

Fonsta allows you take and use fonts in easy way because it works as a package manager, like Bower or npm.
The package interacts with [Font Squirrel](https://www.fontsquirrel.com/) and gets fonts directly from there.

## Install

```sh
$ npm install -g fonsta
```

## Usage

### Installing fonts and dependencies

```sh
# install dependencies from fonsta.deps.json
$ fonsta install

# install a font with regular style and add it to fonsta.deps.json
$ fonsta install <font> --save

# install a font with specific styles and add it to fonsta.deps.json
$ bower install <font>:<style>,<style>,<style> --save
```

### Using fonts

Once you have got the font, css file will be generated with @font-face for chosen font. [See below](#configuration) how to configure all file paths.

### Uninstalling fonts

```sh
# uninstall a font with all available styles
$ fonsta uninstall <font>

# uninstall a font with specific styles
$ fonsta uninstall <font>:<style>,<style>
```

### Show all available styles of a font

```sh
$ fonsta show <font>
```

## Configuration

Fonsta can be configured by a `fonsta.config.json` file. For example:

```json
{
	"tmpDir": "/tmp/fonts",
	"fontsDir": "/assets/fonts",
	"cssDir": "/assets/css",
	"cssFile": "fonts.css"
}
```

`tmpDir` - temporary directory which stores downloaded fonts (cleaned after installation)
`fontsDir` - directory which stores resulting fonts
`cssDir` - directory which stores generated css file
`cssFile` - name for css file where will be included generated @font-face
