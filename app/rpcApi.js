var genesisCoinbaseTransactionTxid = "41c62dbd9068c89a449525e3cd5ac61b20ece28c3c38b3f35b2161f0e6d3cb0d";
var genesisCoinbaseTransaction = {
	"hex": "0100000000000000000000000000000000000000000000000000000000000000000000000dcbd3e6f061215bf3b3383c8ce2ec201bc65acde32595449ac86890bd2dc641c133aa4dff7f001c92a11ea20101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff5404ff7f001c020a024b2e2e2e2063686f6f7365207768617420636f6d6573206e6578742e20204c69766573206f6620796f7572206f776e2c206f7220612072657475726e20746f20636861696e732e202d2d2056ffffffff0100f2052a01000000434104b620369050cd899ffbbc4e8ee51e8c4534a855bb463439d63d235d4779685d8b6f4870a238cf365ac94fa13ef9a2a22cd99d0d5ee86dcabcafce36c7acf43ce5ac00000000",
	"txid": "41c62dbd9068c89a449525e3cd5ac61b20ece28c3c38b3f35b2161f0e6d3cb0d",
	"hash": "41c62dbd9068c89a449525e3cd5ac61b20ece28c3c38b3f35b2161f0e6d3cb0d",
	"size": 292,
	"vsize": 292,
	"version": 1,
	"confirmations":1811896,
	"vin": [
		{
			"coinbase": "04ff7f001c020a024b2e2e2e2063686f6f7365207768617420636f6d6573206e6578742e20204c69766573206f6620796f7572206f776e2c206f7220612072657475726e20746f20636861696e732e202d2d2056",
			"sequence": 4294967295
		}
	],
	"vout": [
		{
			"value": 50.00000000,
			"n": 0,
			"scriptPubKey": {
				"asm": "04b620369050cd899ffbbc4e8ee51e8c4534a855bb463439d63d235d4779685d8b6f4870a238cf365ac94fa13ef9a2a22cd99d0d5ee86dcabcafce36c7acf43ce5 OP_CHECKSIG",
				"hex": "0000000000000000000000000000000000000000000000000000000000000000",
				"reqSigs": 1,
				"type": "pubkey",
				"addresses": [
					"N1Gi2mS1VSp1wRj2RU3ZU7t1N1zdsRTuWg"
				]
			}
		}
	],
	"blockhash": "000000000062b72c5e2ceb45fbc8587e807c155b0da735e6483dfba2f0a9c770",
	"time": 1303000001,
	"blocktime": 1303000001
};

function getInfo() {
	return new Promise(function(resolve, reject) {
		client.cmd('getinfo', function(err, result, resHeaders) {
			if (err) {
				return console.log("Error 3207fh0f: " + err);
			}

			resolve(result);
		});
	});
}

function getBlockByHeight(blockHeight) {
	console.log("getBlockByHeight: " + blockHeight);

	return new Promise(function(resolve, reject) {
		var client = global.client;
		
		client.cmd('getblockhash', blockHeight, function(err, result, resHeaders) {
			if (err) {
				return console.log("Error 0928317yr3w: " + err);
			}

			client.cmd('getblock', result, function(err2, result2, resHeaders2) {
				if (err2) {
					return console.log("Error 320fh7e0hg: " + err2);
				}

				resolve({ success:true, getblockhash:result, getblock:result2 });
			});
		});
	});
}

function getBlocksByHeight(blockHeights) {
	console.log("getBlocksByHeight: " + blockHeights);

	return new Promise(function(resolve, reject) {
		var batch = [];
		for (var i = 0; i < blockHeights.length; i++) {
			batch.push({
				method: 'getblockhash',
				params: [ blockHeights[i] ]
			});
		}

		var blockHashes = [];
		client.cmd(batch, function(err, result, resHeaders) {
			blockHashes.push(result);

			if (blockHashes.length == batch.length) {
				var batch2 = [];
				for (var i = 0; i < blockHashes.length; i++) {
					batch2.push({
						method: 'getblock',
						params: [ blockHashes[i] ]
					});
				}

				var blocks = [];
				client.cmd(batch2, function(err2, result2, resHeaders2) {
					if (err2) {
						console.log("Error 138ryweufdf: " + err2);
					}

					blocks.push(result2);
					if (blocks.length == batch2.length) {
						resolve(blocks);
					}
				});
			}
		});
	});
}

function getBlockByHash(blockHash) {
	console.log("getBlockByHash: " + blockHash);

	return new Promise(function(resolve, reject) {
		var client = global.client;
		
		client.cmd('getblock', blockHash, function(err, result, resHeaders) {
			if (err) {
				console.log("Error 0u2fgewue: " + err);
			}

			resolve(result);
		});
	});
}

function getTransactionInputs(rpcClient, transaction) {
	console.log("getTransactionInputs: " + transaction.txid);

	return new Promise(function(resolve, reject) {
		var txids = [];
		for (var i = 0; i < transaction.vin.length; i++) {
			txids.push(transaction.vin[i].txid);
		}

		getRawTransactions(txids).then(function(inputTransactions) {
			resolve({ txid:transaction.txid, inputTransactions:inputTransactions });
		});
	});
}

function getRawTransaction(txid) {
	return new Promise(function(resolve, reject) {
		if (txid == genesisCoinbaseTransactionTxid) {
			getBlockByHeight(0).then(function(blockZeroResult) {
				var result = genesisCoinbaseTransaction;
				result.confirmations = blockZeroResult.getblock.confirmations;

				resolve(result);
			});
			
			return;
		}

		client.cmd('getrawtransaction', txid, 1, function(err, result, resHeaders) {
			if (err) {
				console.log("Error 329813yre823: " + err);
			}

			resolve(result);
		});
	});
}

function getRawTransactions(txids) {
	console.log("getRawTransactions: " + txids);

	return new Promise(function(resolve, reject) {
		if (!txids || txids.length == 0) {
			resolve([]);

			return;
		}

		if (txids.length == 1 && txids[0] == "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b") {
			// copy the "confirmations" field from genesis block to the genesis-coinbase tx
			getBlockByHeight(0).then(function(blockZeroResult) {
				var result = genesisCoinbaseTransaction;
				result.confirmations = blockZeroResult.getblock.confirmations;

				resolve([result]);
			});

			return;
		}

		var batch = [];
		for (var i = 0; i < txids.length; i++) {
			var txid = txids[i];

			batch.push({
				method: 'getrawtransaction',
				params: [ txid, 1 ]
			});
		}

		var results = [];

		var count = batch.length;
		client.cmd(batch, function(err, result, resHeaders) {
			if (err) {
				console.log("Error 10238rhwefyhd: " + err);
			}

			results.push(result);

			count--;

			if (count == 0) {
				resolve(results);
			}
		});
	});
}

function getBlockData(rpcClient, blockHash, txLimit, txOffset) {
	console.log("getBlockData: " + blockHash);

	return new Promise(function(resolve, reject) {
		client.cmd('getblock', blockHash, function(err2, result2, resHeaders2) {
			if (err2) {
				console.log("Error 3017hfwe0f: " + err2);

				reject(err2);

				return;
			}

			var txids = [];
			for (var i = txOffset; i < Math.min(txOffset + txLimit, result2.tx.length); i++) {
				txids.push(result2.tx[i]);
			}

			getRawTransactions(txids).then(function(transactions) {
				var txInputsByTransaction = {};

				var promises = [];
				for (var i = 0; i < transactions.length; i++) {
					var transaction = transactions[i];

					if (transaction) {
						promises.push(getTransactionInputs(client, transaction));
					}
				}

				Promise.all(promises).then(function() {
					var results = arguments[0];
					for (var i = 0; i < results.length; i++) {
						var resultX = results[i];

						txInputsByTransaction[resultX.txid] = resultX.inputTransactions;
					}

					resolve({ getblock:result2, transactions:transactions, txInputsByTransaction:txInputsByTransaction });
				});
			});
		});
	});
}

module.exports = {
	getInfo: getInfo,
	getBlockByHeight: getBlockByHeight,
	getBlocksByHeight: getBlocksByHeight,
	getBlockByHash: getBlockByHash,
	getTransactionInputs: getTransactionInputs,
	getBlockData: getBlockData,
	getRawTransaction: getRawTransaction,
	getRawTransactions: getRawTransactions
};
