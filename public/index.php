<?php

function checkHost() {
    $blockchains = ['tron'];
    $host = $_SERVER['HTTP_HOST'];
    $elements = explode('.', $host, 2);
    $domain = $elements[1];
    $url = $domain.$_SERVER['REQUEST_URI'];
    if (in_array($domain, ['newdex.io','newdex.vip'])) {
        //m.newdex.io or m.newdex.vip
        $blockchain = isset($_COOKIE['tradeCode']) ? trim($_COOKIE['tradeCode']) : '';
        if (in_array($blockchain, $blockchains)) {
            header("Location: https://m.{$blockchain}.{$url}");
            return false;
        }
    }
    return true;
}

function checkMobile() {
    //todo:check mobile
    return true;
}

function showIndex() {
    echo file_get_contents('./index.html');
}

if (checkHost()) {
    if (checkMobile()) {
        showIndex();
    }
}