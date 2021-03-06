import rule from "../src/no-mix-dearu-desumasu"
import TextLintTester from "textlint-tester";
var tester = new TextLintTester();
// ruleName, rule, expected[]
tester.run("no-mix-dearu-desumasu", rule, {
    valid: [
        "昨日はいい天気であったのだが、今日は悪天候である。",
        {
            text: "昨日はいい天気であったのだが、今日は悪天候である。",
            options: {
                preferInBody: "である"
            }
        },
        {
            // ですがはstrict:false(=デフォルト)では無視される
            text: "昨日はいい天気ですが、今日は悪天候である。",
            options: {
                preferInBody: "である"
            }
        },
        `今日はいい天気ですね。

そうですね。`,
        // 本文と箇条書きは別のカウント
        `
今日はいい天気ですね。

- 今日はいい天気である。
`,
        // 見出しと箇条書きも別カウント
        `
# 今日はいい天気ですね

- 今日はいい天気である。
`,
        // 見出しと本文も別カウント
        `
# 今日はいい天気ですね

今日はいい天気である。
`,
        {
            // であるがは"接続"的なものなので無視される
            text: `AはBである
CはDです。`,
            options: {
                strict: false
            }
        },
        {
            text: "Aである`code`です。"
        },
        // ignore BlockQuote
        {
            text: `
> 今日はいい天気ですね。
> 今日はいい天気である。
`
        },
        // ignore code
        {
            text: `
[今日はいい天気ですね。](http://example.com)
[今日はいい天気である。](http://example.com)
`
        }

    ],
    invalid: [
        // 本文での混在
        {
            text: `今日はいい天気ですね。
今日はいい天気である。
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "である。" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 2,
                    column: 8
                }
            ]
        },
        // 本文での混在が複数ある場合
        {
            text: `今日はいい天気ですね。
今日はいい天気ですね。
今日はいい天気ですね。
今日はいい天気である。
明日はいい天気である。
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "である。" がである調
Total:
である  : 2
ですます: 3
`,
                    line: 4,
                    column: 8
                },
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "である。" がである調
Total:
である  : 2
ですます: 3
`,
                    line: 5,
                    column: 8
                }

            ]
        },
        // 見出し間での混在
        {
            text: `
# 今日はいい天気ですね

## 今日はいい天気である
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `見出し: "である"調 と "ですます"調 が混在
=> "である" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 4,
                    column: 11
                }
            ]
        },
        // 箇条書き間での混在
        {
            text: `
- 今日はいい天気ですね
- 今日はいい天気である
`,
            errors: [
                // 同数である場合は、"ですます"に統一するのを優先する
                {
                    message: `箇条書き: "である"調 と "ですます"調 が混在
=> "である" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 3,
                    column: 10
                }
            ]
        },

        // 優先オプションを指定した場合
        {
            text: `今日はいい天気ですね。
今日はいい天気ですね。
今日はいい天気ですね。
今日はいい天気である。
明日はいい天気である。
`,
            options: {
                preferInBody: "である"
            },
            errors: [
                // 優先指定した、"ですます" に統一するのを優先する
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "ですね。" がですます調
Total:
である  : 2
ですます: 3
`,
                    line: 1,
                    column: 8
                },
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "ですね。" がですます調
Total:
である  : 2
ですます: 3
`,
                    line: 2,
                    column: 8
                },
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "ですね。" がですます調
Total:
である  : 2
ですます: 3
`,
                    line: 3,
                    column: 8
                }
            ]
        },
        // strict
        {
            text: "昨日はいい天気であったが、今日は雨です。",
            options: {
                strict: true
            },
            errors: [[
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "である。" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 1,
                    column: 18
                }
            ]
            ]
        },
        {
            //                 vvvv
            text: `今日はいい天気であるが、明日はどうなるか分からない。
しかし、今日はいい天気ですね。だが明日はどうなるかわからないのである。`,
            options: {
                preferInBody: "である",
                strict: true
            },
            errors: [
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "ですね。" がですます調
Total:
である  : 2
ですます: 1
`,
                    line: 2,
                    column: 12
                }
            ]
        },
        {
            // "AはBである"は"接続"的なものなので無視
            text: `AはBである
CはDです。
一方、AとCは同じものである。
`,
            options: {
                preferInBody: "です",
                strict: false
            },
            errors: [
                {
                    message: `本文: "である"調 と "ですます"調 が混在
=> "である。" がである調
Total:
である  : 1
ですます: 1
`,
                    line: 3,
                    column: 12
                }
            ]
        }
    ]
});