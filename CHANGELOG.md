# Changelog

## [1.0.1](https://github.com/storipress/leaky-paywall/compare/v1.0.0...v1.0.1) (2024-02-29)


### Bug Fixes

* add terraform init ([e2f5977](https://github.com/storipress/leaky-paywall/commit/e2f5977b562a24c2090862b48b1d583a72ca8e02))

## 1.0.0 (2024-02-29)

### Features

- add basic tracking system ([9675f38](https://github.com/storipress/leaky-paywall/commit/9675f38947bde2a816eb27994f7827287930b81f))
- add form validation ([40fdadb](https://github.com/storipress/leaky-paywall/commit/40fdadbb286039d57eda8ca6991d975f42650e21))
- add prototype of leaky paywall component ([a453548](https://github.com/storipress/leaky-paywall/commit/a45354801c3a98292c36c0dc4f09de0ade9e47c9))
- add scroll detect + mock article ([b8e6bf5](https://github.com/storipress/leaky-paywall/commit/b8e6bf53a8f0209965c609d0aeb889ad11eb0592))
- add tracking ([96e73b0](https://github.com/storipress/leaky-paywall/commit/96e73b00c2a4b8eda036a6d00beec1e6dfb62784))
- append to body ([5aab149](https://github.com/storipress/leaky-paywall/commit/5aab14943df32edd4412cfad3fd9516328c205d1))
- connect sign in and signup api ([6a7095e](https://github.com/storipress/leaky-paywall/commit/6a7095e964755192ab519d2b4b31de3c191dc33e))
- connect tracking api ([83de4da](https://github.com/storipress/leaky-paywall/commit/83de4da778b4f3dcf74662a5061fd27fa7d5a296))
- impl selective enable ([3deff03](https://github.com/storipress/leaky-paywall/commit/3deff03e96781d44387e3a86602aa268368c5888))
- open paywall after user idle for 1s ([2e0268a](https://github.com/storipress/leaky-paywall/commit/2e0268aaced58024a38d97ddf91d5de5ccd41abd))
- pack as custom element ([751656a](https://github.com/storipress/leaky-paywall/commit/751656a088e7dfcde2cc1110a479237415ed4fab))
- record read article and allow limit free article ([fa84e57](https://github.com/storipress/leaky-paywall/commit/fa84e57eac2ed185efb8e4fa9df6748ac25b8491))
- support load config from window ([7c17931](https://github.com/storipress/leaky-paywall/commit/7c179314d0fdf3c450acf85573b78d31a4f270b2))
- support login ([ec71631](https://github.com/storipress/leaky-paywall/commit/ec71631720ab0967da2b6bb35fae6afada5d5d24))
- support track link ([223497f](https://github.com/storipress/leaky-paywall/commit/223497fb88d0877f4f4a20ba094befe17e5ff21a))
- switch sign in and subscribe mode ([e8d34a3](https://github.com/storipress/leaky-paywall/commit/e8d34a3c822acc6075b729584e9ab000b04d2603))
- track scroll depth [SPMVP-7160] ([#3](https://github.com/storipress/leaky-paywall/issues/3)) ([2767c65](https://github.com/storipress/leaky-paywall/commit/2767c65cedcab241cf4bb96fe96e1a4744efb737))
- update tracking ([22ca31d](https://github.com/storipress/leaky-paywall/commit/22ca31d1246dafda8459ea855b467f2e4b13d129))

### Bug Fixes

- add auto complete hint ([d589d2b](https://github.com/storipress/leaky-paywall/commit/d589d2b7b166dc2c7e9552a24915a087561affb5))
- add custom portal target to fix css issue ([b10b830](https://github.com/storipress/leaky-paywall/commit/b10b830cedbabafcabc18c6a730454d054017444))
- add v-if ([3b605a0](https://github.com/storipress/leaky-paywall/commit/3b605a0f00d9a603c0a0562b08497d6d9f440107))
- adjust config ([9e29233](https://github.com/storipress/leaky-paywall/commit/9e29233bfb736969fb178d92f3bb1e35fea29358))
- adjust event name ([13bd832](https://github.com/storipress/leaky-paywall/commit/13bd832784bb3ee731b11ad5cdcbf65b6c24e23d))
- drop idle detect ([efe3d87](https://github.com/storipress/leaky-paywall/commit/efe3d871b189d55a962206bfa9e15ea40b2e0470))
- fix animation cause unexpectedly validation error ([84904a7](https://github.com/storipress/leaky-paywall/commit/84904a76620725c47f9f3e189c466157d4a8533d))
- fix config ([9644b34](https://github.com/storipress/leaky-paywall/commit/9644b3456445a2f50c8597f8b4608bf4cde08e86))
- fix form reset cause unexpectedly validation error ([0b4d29e](https://github.com/storipress/leaky-paywall/commit/0b4d29eeece2646ee32b56dd3a935dee4aee2506))
- fix link tracking ([63238db](https://github.com/storipress/leaky-paywall/commit/63238db7ca19904af4075aa600556b48eb993588))
- fix paywall trigger tracking ([c0d16bd](https://github.com/storipress/leaky-paywall/commit/c0d16bd5a1a828f4b00b1faf22c45953acac3935))
- fix portal root discover ([dfa07b2](https://github.com/storipress/leaky-paywall/commit/dfa07b244bef3617782c9dd70da50ff44e668ba2))
- fix scroll event trigger too much ([9ffcf78](https://github.com/storipress/leaky-paywall/commit/9ffcf78448129375c5ccf65e07af5b240c359d61))
- fix style and config variable name ([189f6da](https://github.com/storipress/leaky-paywall/commit/189f6da7abd6ebe6b5a5fb57c432828f08bd4652))
- normalize tracking events ([5bc473e](https://github.com/storipress/leaky-paywall/commit/5bc473ea584f16673096aa405f54177774509c36))
- release ([b8fb0b1](https://github.com/storipress/leaky-paywall/commit/b8fb0b10a20c379cf35c1458c1d845602750b812))
- remove autofocus as it cause error ([92758cb](https://github.com/storipress/leaky-paywall/commit/92758cb7af29743f4f92e06091c18005be1bc988))
- remove z-index ([284cce5](https://github.com/storipress/leaky-paywall/commit/284cce5a03906db143c9b633e98a60ab7a915965))
- simpleify config ([a8f4048](https://github.com/storipress/leaky-paywall/commit/a8f4048e449918d72957cbb19995b90ed8273176))
- simplify signin ([e83d71a](https://github.com/storipress/leaky-paywall/commit/e83d71aa3c03d446523ce428abca250567ef467b))
- try add tabindex=-1 to fix focus ([ec1f39f](https://github.com/storipress/leaky-paywall/commit/ec1f39f77c6ebded10714da95c527e3d0f5c8cc0))
- use dialog scroll lock ([c0b7c82](https://github.com/storipress/leaky-paywall/commit/c0b7c8216dbc7bdf1d8d6cabee9c083a9081e242))
