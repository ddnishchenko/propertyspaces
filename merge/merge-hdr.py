#!/usr/bin/python
import sys, getopt
import cv2 as cv
import numpy as np

def main(argv):
	rootFolder = ''
	imageNames = ''
	outputName = 'hdr-image.jpg'
	print(argv)
	try:
		opts, args = getopt.getopt(argv, 'hr:i:o:', ['root_folder=', 'images=', 'output='])
	except getopt.GetoptError:
		print('merge-hdr.py -r <root_folder> -i <images>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print('merge-hdr.py -r <root_folder> -i <images>')
			sys.exit(0)
		elif opt in ('-r', '--root_folder'):
			rootFolder = arg
		elif opt in ('-i', '--images'):
			imageNames = arg.split(',')
		elif opt in ('-o', '--output'):
			outputName = arg; 

	# Loading exposure images into a list
	imgs = list(map(lambda s: rootFolder + '/' + s, imageNames))
	img_list = [cv.imread(fn) for fn in imgs]

	# Exposure fusion using Mertens
	merge_mertens = cv.createMergeMertens()
	res_mertens = merge_mertens.process(img_list)
	res_mertens_8bit = np.clip(res_mertens*255, 0, 255).astype('uint8')
	cv.imwrite(rootFolder + "/" + outputName, res_mertens_8bit)

if __name__ == '__main__':
	main(sys.argv[1:])