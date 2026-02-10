---
{"publish":true,"created":"2025-12-15T18:13:15.775+08:00","modified":"2025-12-20T17:49:56.960+08:00","tags":["software_engineering","ai","claude_code"],"cssclasses":""}
---

****
- github MCP 연동하면 PR 만들 수 있다는데 더 많은 정보를 담을 수 있고 배포 전에 사람이 한번 더 리뷰할 수 있어서 좋은 것 같다.
- `/init` 을 항상 처음에 돌리는 것이 좋다고.
- CLAUDE.md 설명
    - ![[attachments/Pasted image 20251215181413.png]]
- `# ...` : memorize 모드. CLAUDE.md에 내용을 추가할 수 있다고.
- `@{filename}` : 클로드한테 특정 파일을 참조하도록 가이드할 수 있다.
    - ![[attachments/Pasted image 20251215181428.png]]
- 예시
```shell
  # The database schema is defined in the @prisma/schema.prisma file. Reference it anytime you need to understand the structure of data stored in the database.
  
  # 이렇게 하면 CLAUDE.md 파일에 저장되어서 매번 프롬프트를 넣을 때 마다 클로드는 저 파일을 참고하게 됨.
  ```
  
  
- 예제에서 prisma schema 파일을 보여주는데 좋아 보인다.
    - ![[attachments/Pasted image 20251215181458.png]]
- thinking mode가 있었다
    - think - think more - think a lot - think longer - ultrathink
    - ![[attachments/Pasted image 20251215181517.png]]
- ~~vscode에서는 image copy paste가 가능하다.~~ 그게 아니라 터미널에서도 ctrl + v로 가능하다!
- 중간에 course satisfaction survey가 있는게 인상적. 불과 1시간짜리 강의인데도 중간에 피드백을 받으려고 하는구나
    - ![[attachments/Pasted image 20251215181531.png]]
- escape + escape = revert to a previous message
    - ![[attachments/Pasted image 20251215181547.png]]

- Custom commands `/` - along with built in commands, I can add my own
  - add a file like `.claude/commands/audit.md`
  - with $ sign like
  
  ```plaintext
  Write comprehensive tests for: $ARGUMENTS
  
  Testing conventions:
  * Use Vitests with React Testing Library
  * Place test files in a __tests__ directory in the same folder as the source file
  * Name test files as [filename].test.ts(x)
  * Use @/ prefix for imports
  
  Coverage:
  * Test happy paths
  * Test edge cases
  * Test error states
  ```
  
  then run like this `/write_tests the use-auth.ts file in the hooks directory`
- .claude/settings.local.json
  
  => allow permission e.g. `"allow": ["mcp__playwright"]`
  ![[attachments/Pasted image 20251215181611.png]]
- github action - create a new issue, then let claude fix
  ![[attachments/Pasted image 20251215181621.png]]
  
  use  `/install-github-app`
