import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: './src',
      outDir: 'dist',
      format: 'esm',
      builder: 'mkdist',
    },
  ],
  declaration: true,
  clean: true,
})
