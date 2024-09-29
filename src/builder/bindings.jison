%lex
%%
\s+                     /* skip whitespace */
"["                     return 'LEFT_SQUARE';  
"]"                     return 'RIGHT_SQUARE';
":"                     return 'COLON';
"="                     return 'EQUAL';
"<"                     return 'LESSER_THAN';
">"                     return 'GREATER_THAN';
"<="                    return 'LESSER_THAN_OR_EQUAL';
">="                    return 'GREATER_THAN_OR_EQUAL';
"!="                    return 'NOT_EQUAL';
"find"                  return 'FIND';
"filter"                return 'FILTER';
"group"                 return 'GROUP';
"has"                   return 'HAS';
"sort"                  return 'SORT';
"every"                 return 'EVERY';
"some"                  return 'SOME';
"."                     return 'DOT';
","                     return 'COMMA';
[a-zA-Z_][a-zA-Z0-9_]*  return 'IDENTIFIER';
"'"                     return 'SINGLE_QUOTE';
\"                      return 'DOUBLE_QUOTE';
<<EOF>>                 return 'EOF';
.                       /* Skip any other character */
/lex

%start input

%% 

input
    : string_parts EOF
        { return $1.join(''); }
    ;

string_parts
    : string_part string_parts
        { $$ = [$1].concat($2); }
    | string_part
        { $$ = [$1]; }
    ;

string_part
    : identifier_sequence object_expression
        { $$ = `\${${$2}}`; }
    ;

identifier_sequence
    : IDENTIFIER identifier_sequence
        { $$ = `${$1}.${$2}`; }
    | IDENTIFIER
        { $$ = $1; }
    ;

object_expression
    : LEFT_SQUARE IDENTIFIER RIGHT_SQUARE property_chain
        { $$ = `[${$2}]?.${$4}`; }
    | LEFT_SQUARE operation RIGHT_SQUARE property_chain
        { $$ = `${$2}?.${$4}`; }
    ;

operation
    : FIND COLON condition
        { $$ = `find(e => e.${$3})`; }
    | FILTER COLON condition
        { $$ = `filter(e => e.${$3})`; }
    | GROUP COLON condition
        { $$ = `group(e => e.${$3})`; }
    | HAS COLON condition
        { $$ = `findIndex (e => e.${$3}) > -1`; }
    | SORT COLON condition
        { $$ = `sort(e => e.${$3})`; }
    | EVERY COLON condition
        { $$ = `every(e => e.${$3})`; }
    | SOME COLON condition
        { $$ = `some(e => e.${$3})`; }
    ;

condition
    : IDENTIFIER operand SINGLE_QUOTE IDENTIFIER SINGLE_QUOTE
        { $$ = `${$1} ${$2} '${$4}'`; }
    | IDENTIFIER operand DOUBLE_QUOTE IDENTIFIER DOUBLE_QUOTE
        { $$ = `${$1} ${$2} "${$4}"`; }
    | IDENTIFIER operand IDENTIFIER
        { $$ = `${$1} ${$2} ${$4}`; }
    ;

operand
    : EQUAL { $$ = '===';}
    | LESSER_THAN { $$ = '<';}
    | GREATER_THAN { $$ = '>';}
    | LESSER_THAN_OR_EQUAL { $$ = '<=';}
    | GREATER_THAN_OR_EQUAL { $$ = '>=';}
    | NOT_EQUAL { $$ = '!=';}
    ;

property_chain
    : DOT IDENTIFIER property_chain
        { $$ = `${$2}?.${$3}`; }
    | DOT IDENTIFIER
        { $$ = $2; }
    ; 

%% 
